import { render } from "@alloy-js/core";
import { describe, expect, it } from "vitest";
import * as php from "../src/index.js";

describe("PHP Integration", () => {
  it("should render a complete PHP application", () => {
    const result = render(
      <php.ProjectDirectory 
        name="blog-system"
        composerConfig={{
          name: "example/blog-system",
          description: "A simple blog system",
          autoload: {
            "psr-4": {
              "App\\": "src/"
            }
          }
        }}
      >
        {/* User model */}
        <php.SourceFile path="Models/User.php">
          <php.Namespace name="App\Models">
            <php.Class name="User">
              <php.Property name="id" type="int" visibility="private" readonly />
              <php.Property name="name" type="string" visibility="private" />
              <php.Property name="email" type="string" visibility="private" />

              <php.Method 
                name="__construct"
                visibility="public"
                parameters={[
                  { name: "id", type: "int" },
                  { name: "name", type: "string" },
                  { name: "email", type: "string" }
                ]}
              >
                $this->id = $id;
                $this->name = $name;
                $this->email = $email;
              </php.Method>

              <php.Method name="getId" visibility="public" returnType="int">
                return $this->id;
              </php.Method>

              <php.Method name="getName" visibility="public" returnType="string">
                return $this->name;
              </php.Method>

              <php.Method name="getEmail" visibility="public" returnType="string">
                return $this->email;
              </php.Method>
            </php.Class>
          </php.Namespace>
        </php.SourceFile>

        {/* Post model */}
        <php.SourceFile path="Models/Post.php">
          <php.Namespace name="App\Models">
            <php.Class name="Post">
              <php.Property name="title" type="string" visibility="private" />
              <php.Property name="content" type="string" visibility="private" />
              <php.Property name="author" type="User" visibility="private" />

              <php.Method name="getTitle" visibility="public" returnType="string">
                return $this->title;
              </php.Method>

              <php.Method name="getContent" visibility="public" returnType="string">
                return $this->content;
              </php.Method>

              <php.Method name="getAuthor" visibility="public" returnType="User">
                return $this->author;
              </php.Method>
            </php.Class>
          </php.Namespace>
        </php.SourceFile>

        {/* Blog service interface */}
        <php.SourceFile path="Services/BlogServiceInterface.php">
          <php.Namespace name="App\Services">
            <php.Interface name="BlogServiceInterface">
              <php.Method 
                name="createPost" 
                visibility="public" 
                abstract
                returnType="Post"
                parameters={[
                  { name: "title", type: "string" },
                  { name: "content", type: "string" },
                  { name: "author", type: "User" }
                ]}
              />
              
              <php.Method 
                name="getPostsByUser" 
                visibility="public" 
                abstract
                returnType="array"
                parameters={[{ name: "user", type: "User" }]}
              />
            </php.Interface>
          </php.Namespace>
        </php.SourceFile>
      </php.ProjectDirectory>,
      { namePolicy: php.createPhpNamePolicy() }
    );

    // Verify composer.json exists
    const composerFile = result.find(f => f.path === "blog-system/composer.json");
    expect(composerFile).toBeDefined();

    // Verify User model
    const userFile = result.find(f => f.path === "blog-system/src/Models/User.php");
    expect(userFile).toBeDefined();
    expect(userFile!.contents).toContain("namespace App\\Models;");
    expect(userFile!.contents).toContain("class User");
    expect(userFile!.contents).toContain("private readonly int $id;");

    // Verify Post model  
    const postFile = result.find(f => f.path === "blog-system/src/Models/Post.php");
    expect(postFile).toBeDefined();
    expect(postFile!.contents).toContain("namespace App\\Models;");
    expect(postFile!.contents).toContain("class Post");

    // Verify interface
    const serviceFile = result.find(f => f.path === "blog-system/src/Services/BlogServiceInterface.php");
    expect(serviceFile).toBeDefined();
    expect(serviceFile!.contents).toContain("interface BlogServiceInterface");
    expect(serviceFile!.contents).toContain("public abstract function createPost");
  });
}); 