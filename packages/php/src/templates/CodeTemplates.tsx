import { Children } from "@alloy-js/core";
import { usePhpNamePolicy } from "../name-policy.js";
import {
  Class,
  Interface,
  Method,
  Property,
  Constructor,
  Trait,
  Enum
} from "../components/index.js";

export interface SingletonPatternProps {
  /** Class name */
  name: string;
  /** Whether to make constructor private */
  privateConstructor?: boolean;
  /** Additional methods */
  additionalMethods?: Children;
}

/**
 * Generates a Singleton pattern implementation
 */
export function SingletonPattern(props: SingletonPatternProps) {
  const { name, privateConstructor = true, additionalMethods } = props;
  const namePolicy = usePhpNamePolicy();
  const className = namePolicy.getName(name, "class");

  return (
    <Class name={className}>
      {/* Static instance property */}
      <Property
        name="instance"
        visibility="private"
        static={true}
        type={`?${className}`}
        defaultValue="null"
      />

      {/* Private constructor */}
      {privateConstructor && (
        <Constructor visibility="private" />
      )}

      {/* Prevent cloning */}
      <Method name="__clone" visibility="private" returnType="void">
        // Prevent cloning
      </Method>

      {/* Prevent unserialization */}
      <Method name="__wakeup" visibility="private" returnType="void">
        // Prevent unserialization
      </Method>

      {/* Static getInstance method */}
      <Method
        name="getInstance"
        visibility="public"
        static={true}
        returnType={className}
      >
        {`if (self::$instance === null) {
    self::$instance = new self();
}

return self::$instance;`}
      </Method>

      {additionalMethods}
    </Class>
  );
}

export interface FactoryPatternProps {
  /** Factory class name */
  name: string;
  /** Product interface/class */
  productType: string;
  /** Product implementations */
  products: Array<{
    name: string;
    key: string;
    className: string;
  }>;
}

/**
 * Generates a Factory pattern implementation
 */
export function FactoryPattern(props: FactoryPatternProps) {
  const { name, productType, products } = props;
  const namePolicy = usePhpNamePolicy();
  const className = namePolicy.getName(name, "class");

  return (
    <Class name={className}>
      {/* Static create method */}
      <Method
        name="create"
        visibility="public"
        static={true}
        parameters={[{ name: "type", type: "string" }]}
        returnType={productType}
      >
        {`switch ($type) {
${products.map(product => `    case '${product.key}':
        return new ${product.className}();`).join('\n')}
    default:
        throw new \\InvalidArgumentException("Unknown product type: $type");
}`}
      </Method>

      {/* Static getSupportedTypes method */}
      <Method
        name="getSupportedTypes"
        visibility="public"
        static={true}
        returnType="array"
      >
        {`return [${products.map(p => `'${p.key}'`).join(', ')}];`}
      </Method>
    </Class>
  );
}

export interface ObserverPatternProps {
  /** Subject class name */
  subjectName: string;
  /** Observer interface name */
  observerName?: string;
  /** Event types */
  eventTypes?: string[];
}

/**
 * Generates Observer pattern implementation
 */
export function ObserverPattern(props: ObserverPatternProps) {
  const { 
    subjectName, 
    observerName = "Observer", 
    eventTypes = ["update"] 
  } = props;
  
  const namePolicy = usePhpNamePolicy();
  const subjectClass = namePolicy.getName(subjectName, "class");
  const observerInterface = namePolicy.getName(observerName, "interface");

  return (
    <>
      {/* Observer Interface */}
      <Interface name={observerInterface}>
        {eventTypes.map(eventType => (
          <Method
            key={eventType}
            name={eventType}
            visibility="public"
            parameters={[
              { name: "subject", type: subjectClass },
              { name: "data", type: "mixed", defaultValue: "null" }
            ]}
            returnType="void"
          />
        ))}
      </Interface>

      {/* Subject Class */}
      <Class name={subjectClass}>
        {/* Observers collection */}
        <Property
          name="observers"
          visibility="private"
          type="array"
          defaultValue="[]"
        />

        {/* Attach observer */}
        <Method
          name="attach"
          visibility="public"
          parameters={[{ name: "observer", type: observerInterface }]}
          returnType="void"
        >
          $this->observers[] = $observer;
        </Method>

        {/* Detach observer */}
        <Method
          name="detach"
          visibility="public"
          parameters={[{ name: "observer", type: observerInterface }]}
          returnType="void"
        >
          {`$key = array_search($observer, $this->observers, true);
if ($key !== false) {
    unset($this->observers[$key]);
}`}
        </Method>

        {/* Notify observers */}
        <Method
          name="notify"
          visibility="protected"
          parameters={[
            { name: "eventType", type: "string" },
            { name: "data", type: "mixed", defaultValue: "null" }
          ]}
          returnType="void"
        >
          {`foreach ($this->observers as $observer) {
    if (method_exists($observer, $eventType)) {
        $observer->$eventType($this, $data);
    }
}`}
        </Method>
      </Class>
    </>
  );
}

export interface RepositoryPatternProps {
  /** Entity name */
  entityName: string;
  /** Repository name */
  repositoryName?: string;
  /** Include interface */
  includeInterface?: boolean;
  /** Custom methods */
  customMethods?: Array<{
    name: string;
    parameters?: Array<{ name: string; type?: string }>;
    returnType?: string;
    body?: string;
  }>;
}

/**
 * Generates Repository pattern implementation
 */
export function RepositoryPattern(props: RepositoryPatternProps) {
  const {
    entityName,
    repositoryName,
    includeInterface = true,
    customMethods = []
  } = props;

  const namePolicy = usePhpNamePolicy();
  const entityClass = namePolicy.getName(entityName, "class");
  const repoClass = namePolicy.getName(
    repositoryName || `${entityName}Repository`, 
    "class"
  );
  const repoInterface = `${repoClass}Interface`;

  return (
    <>
      {/* Repository Interface */}
      {includeInterface && (
        <Interface name={repoInterface}>
          <Method
            name="findById"
            visibility="public"
            parameters={[{ name: "id", type: "int" }]}
            returnType={`?${entityClass}`}
          />

          <Method
            name="findAll"
            visibility="public"
            returnType="array"
          />

          <Method
            name="save"
            visibility="public"
            parameters={[{ name: "entity", type: entityClass }]}
            returnType="void"
          />

          <Method
            name="delete"
            visibility="public"
            parameters={[{ name: "entity", type: entityClass }]}
            returnType="void"
          />

          {customMethods.map(method => (
            <Method
              key={method.name}
              name={method.name}
              visibility="public"
              parameters={method.parameters}
              returnType={method.returnType}
            />
          ))}
        </Interface>
      )}

      {/* Repository Implementation */}
      <Class 
        name={repoClass} 
        implements={includeInterface ? [repoInterface] : undefined}
      >
        {/* Database connection property */}
        <Property
          name="connection"
          visibility="private"
          type="\\PDO"
        />

        {/* Constructor */}
        <Constructor
          visibility="public"
          parameters={[{ name: "connection", type: "\\PDO" }]}
        >
          $this->connection = $connection;
        </Constructor>

        {/* Find by ID */}
        <Method
          name="findById"
          visibility="public"
          parameters={[{ name: "id", type: "int" }]}
          returnType={`?${entityClass}`}
        >
          {`// TODO: Implement findById for ${entityClass}
return null;`}
        </Method>

        {/* Find all */}
        <Method
          name="findAll"
          visibility="public"
          returnType="array"
        >
          {`// TODO: Implement findAll for ${entityClass}
return [];`}
        </Method>

        {/* Save */}
        <Method
          name="save"
          visibility="public"
          parameters={[{ name: "entity", type: entityClass }]}
          returnType="void"
        >
          {`// TODO: Implement save for ${entityClass}`}
        </Method>

        {/* Delete */}
        <Method
          name="delete"
          visibility="public"
          parameters={[{ name: "entity", type: entityClass }]}
          returnType="void"
        >
          {`// TODO: Implement delete for ${entityClass}`}
        </Method>

        {/* Custom methods */}
        {customMethods.map(method => (
          <Method
            key={method.name}
            name={method.name}
            visibility="public"
            parameters={method.parameters}
            returnType={method.returnType}
          >
            {method.body || `// TODO: Implement ${method.name}`}
          </Method>
        ))}
      </Class>
    </>
  );
}

export interface ValueObjectPatternProps {
  /** Value object name */
  name: string;
  /** Properties */
  properties: Array<{
    name: string;
    type: string;
    validation?: string;
  }>;
  /** Include validation methods */
  includeValidation?: boolean;
}

/**
 * Generates Value Object pattern implementation
 */
export function ValueObjectPattern(props: ValueObjectPatternProps) {
  const { name, properties, includeValidation = true } = props;
  const namePolicy = usePhpNamePolicy();
  const className = namePolicy.getName(name, "class");

  return (
    <Class name={className} final={true}>
      {/* Properties */}
      {properties.map(prop => (
        <Property
          key={prop.name}
          name={prop.name}
          visibility="private"
          readonly={true}
          type={prop.type}
        />
      ))}

      {/* Constructor */}
      <Constructor
        visibility="public"
        parameters={properties.map(prop => ({
          name: prop.name,
          type: prop.type
        }))}
      >
        {includeValidation && properties.some(p => p.validation) && 
          properties
            .filter(p => p.validation)
            .map(prop => `$this->validate${namePolicy.getName(prop.name, "class")}($${prop.name});`)
            .join('\n')
        }
        
        {properties.map(prop => 
          `$this->${prop.name} = $${prop.name};`
        ).join('\n')}
      </Constructor>

      {/* Getters */}
      {properties.map(prop => (
        <Method
          key={`get${prop.name}`}
          name={`get${namePolicy.getName(prop.name, "class")}`}
          visibility="public"
          returnType={prop.type}
        >
          return $this->{prop.name};
        </Method>
      ))}

      {/* Validation methods */}
      {includeValidation && properties
        .filter(prop => prop.validation)
        .map(prop => (
          <Method
            key={`validate${prop.name}`}
            name={`validate${namePolicy.getName(prop.name, "class")}`}
            visibility="private"
            parameters={[{ name: "value", type: prop.type }]}
            returnType="void"
          >
            {prop.validation || `// TODO: Add validation for ${prop.name}`}
          </Method>
        ))}

      {/* Equals method */}
      <Method
        name="equals"
        visibility="public"
        parameters={[{ name: "other", type: className }]}
        returnType="bool"
      >
        {`return ${properties.map(prop => 
          `$this->${prop.name} === $other->${prop.name}`
        ).join(' && ')};`}
      </Method>

      {/* toString method */}
      <Method
        name="__toString"
        visibility="public"
        returnType="string"
      >
        {`return json_encode([
${properties.map(prop => `    '${prop.name}' => $this->${prop.name}`).join(',\n')}
]);`}
      </Method>
    </Class>
  );
} 