# @alloy-js/php

## 0.19.0

### Features

- **Initial PHP support**: Complete PHP code generation framework
- **PSR compliance**: Follows PSR-1, PSR-4, and PSR-12 standards  
- **Modern PHP features**: Support for PHP 8.0+ including type hints, readonly properties
- **Composer integration**: Automatic composer.json generation with PSR-4 autoloading
- **Complete OOP support**: Classes, interfaces, methods, properties, and namespaces
- **Smart imports**: Automatic use statement generation and namespace resolution
- **Naming policies**: PSR-compliant naming conventions with reserved word handling

### Components

- `SourceFile`: PHP source files with proper syntax
- `Namespace`: PSR-4 namespace declarations  
- `Class`: Class declarations with inheritance and interfaces
- `Interface`: Interface declarations with method signatures
- `Trait`: PHP trait declarations with use statements
- `Enum`: PHP 8.1+ enum declarations with backing values
- `Method`: Method declarations with parameters and return types
- `Constructor`: Class constructors with parameter promotion
- `Property`: Class properties with visibility and type hints
- `Function`: Global function declarations
- `Constant`: Global and class constants
- `Variable`: Variable declarations
- `Attribute`: PHP 8.0+ attribute support
- `TypeHint`: Modern type hints with union/intersection types
- `ProjectDirectory`: Complete project structure with Composer support
- `UseStatement`: Automatic import management

### String Template Components

- Complete `/stc` module with string template versions of all components
- Alternative API for non-JSX usage patterns

### Testing

- Comprehensive test suite covering all components
- Integration tests with real-world examples
- Name policy validation tests
- Project generation tests

### Documentation

- Complete API documentation
- Usage examples and tutorials
- Development setup instructions
- PSR compliance guidelines 