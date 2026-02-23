#!/usr/bin/env python3
"""
Thoth API CLI Wrapper

Wrapper script for the Thoth API to create and optimize social media content.
"""

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Optional, Dict, Any
import requests


class ThothAPI:
    """Wrapper for Thoth API operations"""

    BASE_URL = "https://www.usethoth.com/api"
    CONFIG_PATH = Path.home() / ".config" / "thoth" / "config"

    def __init__(self, api_key: Optional[str] = None):
        """Initialize with API key from config or parameter"""
        self.api_key = api_key or self._load_api_key()
        if not self.api_key:
            raise ValueError(
                "API key not found. Please create ~/.config/thoth/config with:\n"
                "THOTH_API_KEY=your_api_key_here"
            )

    def _load_api_key(self) -> Optional[str]:
        """Load API key from config file"""
        if not self.CONFIG_PATH.exists():
            return None

        with open(self.CONFIG_PATH, 'r') as f:
            for line in f:
                line = line.strip()
                if line.startswith('THOTH_API_KEY='):
                    return line.split('=', 1)[1].strip()
        return None

    def _make_request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Make HTTP request to Thoth API"""
        url = f"{self.BASE_URL}{endpoint}"
        headers = {
            "X-API-Key": self.api_key,
            "Content-Type": "application/json"
        }

        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=headers, params=params)
            elif method.upper() == "POST":
                response = requests.post(url, headers=headers, json=data)
            elif method.upper() == "PUT":
                response = requests.put(url, headers=headers, json=data)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")

            response.raise_for_status()
            return response.json()

        except requests.exceptions.HTTPError as e:
            error_msg = f"HTTP Error {response.status_code}: {response.text}"
            raise Exception(error_msg) from e
        except requests.exceptions.RequestException as e:
            raise Exception(f"Request failed: {str(e)}") from e

    def create_post(
        self,
        content: str,
        platforms: list,
        schedule_time: Optional[str] = None,
        create_image: bool = False,
        length: str = "medium",
        create_hashtags: bool = False,
        post_to_social: bool = False
    ) -> Dict[str, Any]:
        """Create optimized post for multiple platforms"""
        data = {
            "content": content,
            "platforms": platforms,
            "createImage": create_image,
            "length": length,
            "createHashtags": create_hashtags,
            "postToSocialNetworks": post_to_social
        }

        if schedule_time:
            data["scheduleTime"] = schedule_time

        return self._make_request("POST", "/v1/posts", data=data)

    def get_post(self, post_id: str) -> Dict[str, Any]:
        """Retrieve post details by ID"""
        return self._make_request("GET", f"/v1/posts/{post_id}")

    def list_posts(
        self,
        page: int = 1,
        limit: int = 10,
        status: Optional[str] = None
    ) -> Dict[str, Any]:
        """List all posts with optional filtering"""
        params = {
            "page": page,
            "limit": limit
        }

        if status:
            params["status"] = status

        return self._make_request("GET", "/v1/posts", params=params)

    def update_post(
        self,
        post_id: str,
        title: Optional[str] = None,
        original_content: Optional[str] = None,
        platform_contents: Optional[list] = None,
        status: Optional[str] = None
    ) -> Dict[str, Any]:
        """Update existing post"""
        data = {}

        if title:
            data["title"] = title
        if original_content:
            data["originalContent"] = original_content
        if platform_contents:
            data["platformContents"] = platform_contents
        if status:
            data["status"] = status

        return self._make_request("PUT", f"/v1/posts/{post_id}", data=data)

    def get_brand_styles(self) -> Dict[str, Any]:
        """Fetch all brand styles"""
        return self._make_request("GET", "/v1/brand-styles")

    def get_brand_style(self, style_id: str) -> Dict[str, Any]:
        """Get specific brand style by ID"""
        return self._make_request("GET", f"/v1/brand-styles/{style_id}")


def format_output(data: Dict[str, Any], json_output: bool = False) -> str:
    """Format API response for display"""
    if json_output:
        return json.dumps(data, indent=2)

    # Human-readable formatting
    if not data.get("success"):
        return f"Error: {data.get('error', 'Unknown error')}"

    result = data.get("data", {})

    # Format based on response type
    if "postId" in result or "id" in result:
        # Single post response
        post_id = result.get("postId") or result.get("id")
        output = [f"Post ID: {post_id}"]

        if "originalContent" in result:
            output.append(f"\nOriginal Content:\n{result['originalContent']}")

        if "platformContents" in result:
            output.append("\nPlatform-Specific Content:")
            for platform, content_data in result["platformContents"].items():
                output.append(f"\n  {platform.upper()}:")
                if isinstance(content_data, dict):
                    output.append(f"    {content_data.get('content', '')}")
                    if content_data.get("hashtags"):
                        hashtags = " ".join([f"#{tag}" for tag in content_data["hashtags"]])
                        output.append(f"    Hashtags: {hashtags}")
                else:
                    output.append(f"    {content_data}")

        if "status" in result:
            output.append(f"\nStatus: {result['status']}")

        if "scheduleTime" in result:
            output.append(f"Scheduled: {result['scheduleTime']}")

        return "\n".join(output)

    elif "posts" in result:
        # List of posts
        output = [f"Total Posts: {result.get('pagination', {}).get('total', len(result['posts']))}"]
        output.append("")

        for post in result["posts"]:
            output.append(f"ID: {post.get('id')}")
            if "title" in post:
                output.append(f"  Title: {post['title']}")
            output.append(f"  Status: {post.get('status', 'unknown')}")
            output.append(f"  Created: {post.get('createdAt', 'N/A')}")
            output.append("")

        return "\n".join(output)

    elif isinstance(result, list):
        # List of brand styles
        output = [f"Brand Styles ({len(result)}):"]
        for style in result:
            output.append(f"\nID: {style.get('id')}")
            output.append(f"  Name: {style.get('name')}")
            output.append(f"  Mode: {style.get('contentMode', 'N/A')}")
            if style.get('isDefault') == 'true':
                output.append("  (Default)")

        return "\n".join(output)

    elif "name" in result and "contentMode" in result:
        # Single brand style
        output = [f"Brand Style: {result.get('name')}"]
        output.append(f"ID: {result.get('id')}")
        output.append(f"Content Mode: {result.get('contentMode')}")

        if result.get('isDefault') == 'true':
            output.append("Default: ✓ (automatically applied to new posts)")

        if "colors" in result:
            output.append("\nBrand Colors:")
            for key, value in result["colors"].items():
                output.append(f"  {key}: {value}")
            output.append("  (Used for AI image generation)")

        if "tone" in result:
            output.append("\nBrand Tone:")
            for key, value in result["tone"].items():
                output.append(f"  {key.capitalize()}: {value}")
            output.append("  (Applied to all written content)")

        if "createdAt" in result:
            output.append(f"\nCreated: {result['createdAt']}")

        # Display any additional fields that might exist
        displayed_fields = {'id', 'name', 'contentMode', 'isDefault', 'colors', 'tone', 'createdAt'}
        remaining_fields = set(result.keys()) - displayed_fields
        if remaining_fields:
            output.append("\nAdditional Properties:")
            for field in sorted(remaining_fields):
                output.append(f"  {field}: {result[field]}")

        return "\n".join(output)

    # Fallback to JSON for unknown formats
    return json.dumps(result, indent=2)


def main():
    parser = argparse.ArgumentParser(description="Thoth API CLI")
    parser.add_argument("--api-key", help="Override API key from config file")
    parser.add_argument("--json", action="store_true", help="Output as JSON")

    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # create-post command
    create_parser = subparsers.add_parser("create-post", help="Create optimized post")
    create_parser.add_argument("content", help="Post content")
    create_parser.add_argument("--platforms", nargs="+", required=True,
                             help="Target platforms (twitter linkedin instagram)")
    create_parser.add_argument("--schedule", help="Schedule time (ISO 8601)")
    create_parser.add_argument("--image", action="store_true", help="Generate AI images")
    create_parser.add_argument("--length", default="medium",
                             choices=["short", "medium", "long"],
                             help="Content length")
    create_parser.add_argument("--hashtags", action="store_true", help="Generate hashtags")
    create_parser.add_argument("--post-now", action="store_true",
                             help="Post to connected social accounts")

    # get-post command
    get_parser = subparsers.add_parser("get-post", help="Get post details")
    get_parser.add_argument("post_id", help="Post ID")

    # list-posts command
    list_parser = subparsers.add_parser("list-posts", help="List all posts")
    list_parser.add_argument("--page", type=int, default=1, help="Page number")
    list_parser.add_argument("--limit", type=int, default=10, help="Posts per page")
    list_parser.add_argument("--status", help="Filter by status (draft/published)")

    # update-post command
    update_parser = subparsers.add_parser("update-post", help="Update existing post")
    update_parser.add_argument("post_id", help="Post ID")
    update_parser.add_argument("--title", help="Updated title")
    update_parser.add_argument("--content", help="Updated content")
    update_parser.add_argument("--status", help="Updated status")

    # get-brand-styles command
    subparsers.add_parser("get-brand-styles", help="Fetch all brand styles")

    # get-brand-style command
    style_parser = subparsers.add_parser("get-brand-style", help="Get specific brand style")
    style_parser.add_argument("style_id", help="Brand style ID")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    try:
        api = ThothAPI(api_key=args.api_key)

        # Execute command
        if args.command == "create-post":
            result = api.create_post(
                content=args.content,
                platforms=args.platforms,
                schedule_time=args.schedule,
                create_image=args.image,
                length=args.length,
                create_hashtags=args.hashtags,
                post_to_social=args.post_now
            )

        elif args.command == "get-post":
            result = api.get_post(args.post_id)

        elif args.command == "list-posts":
            result = api.list_posts(
                page=args.page,
                limit=args.limit,
                status=args.status
            )

        elif args.command == "update-post":
            result = api.update_post(
                post_id=args.post_id,
                title=args.title,
                original_content=args.content,
                status=args.status
            )

        elif args.command == "get-brand-styles":
            result = api.get_brand_styles()

        elif args.command == "get-brand-style":
            result = api.get_brand_style(args.style_id)

        else:
            print(f"Unknown command: {args.command}", file=sys.stderr)
            sys.exit(1)

        # Output result
        print(format_output(result, json_output=args.json))
        sys.exit(0)

    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
