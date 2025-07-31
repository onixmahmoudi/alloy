import { Children } from "@alloy-js/core";
import {
  Attribute,
  Class,
  Constructor,
  Method,
  Property,
} from "../components/index.js";
import { usePhpNamePolicy } from "../name-policy.js";

export interface SymfonyEntityProps {
  /** Entity name */
  name: string;
  /** Database table name */
  table?: string;
  /** Repository class */
  repositoryClass?: string;
  /** Fields */
  fields?: SymfonyField[];
  /** Relationships */
  relationships?: SymfonyRelationship[];
  /** Lifecycle callbacks */
  lifecycleCallbacks?: SymfonyLifecycleCallback[];
  /** Additional attributes */
  additionalAttributes?: Array<{
    name: string;
    arguments?: Array<{ name?: string; value: string }>;
  }>;
  /** Children components */
  children?: Children;
}

export interface SymfonyField {
  name: string;
  type:
    | "string"
    | "integer"
    | "datetime"
    | "boolean"
    | "text"
    | "decimal"
    | "json";
  length?: number;
  nullable?: boolean;
  unique?: boolean;
  default?: string;
  columnName?: string;
  precision?: number;
  scale?: number;
}

export interface SymfonyRelationship {
  name: string;
  type: "OneToOne" | "OneToMany" | "ManyToOne" | "ManyToMany";
  targetEntity: string;
  mappedBy?: string;
  inversedBy?: string;
  joinColumn?: { name: string; referencedColumnName?: string };
  joinTable?: { name: string };
  cascade?: string[];
  fetch?: "LAZY" | "EAGER";
  orphanRemoval?: boolean;
}

export interface SymfonyLifecycleCallback {
  event:
    | "PrePersist"
    | "PostPersist"
    | "PreUpdate"
    | "PostUpdate"
    | "PreRemove"
    | "PostRemove";
  method: string;
}

/**
 * Generates a Symfony Doctrine entity
 */
export function SymfonyEntity(props: SymfonyEntityProps) {
  const {
    name,
    table,
    repositoryClass,
    fields = [],
    relationships = [],
    lifecycleCallbacks = [],
    additionalAttributes = [],
    children,
  } = props;

  const namePolicy = usePhpNamePolicy();
  const className = namePolicy.getName(name, "class");

  return (
    <>
      {/* Entity attribute */}
      <Attribute
        name="Entity"
        arguments={[
          ...(repositoryClass ?
            [{ name: "repositoryClass", value: `${repositoryClass}::class` }]
          : []),
        ]}
      />

      {/* Table attribute */}
      {table && (
        <Attribute
          name="Table"
          arguments={[{ name: "name", value: `"${table}"` }]}
        />
      )}

      {/* Additional attributes */}
      {additionalAttributes.map((attr, index) => (
        <Attribute name={attr.name} arguments={attr.arguments} />
      ))}

      <Class name={className}>
        {/* ID field (auto-generated) */}
        <SymfonyIdField />

        {/* Fields */}
        {fields.map((field) => (
          <SymfonyFieldProperty {...field} />
        ))}

        {/* Relationships */}
        {relationships.map((rel) => (
          <SymfonyRelationshipProperty {...rel} />
        ))}

        {/* Constructor */}
        <Constructor visibility="public">
          {relationships
            .filter(
              (rel) => rel.type === "OneToMany" || rel.type === "ManyToMany",
            )
            .map((rel) => `$this->${rel.name} = new ArrayCollection();`)
            .join("\n")}
        </Constructor>

        {/* Getters and setters */}
        {fields.map((field) => (
          <SymfonyFieldMethods {...field} />
        ))}

        {/* Relationship methods */}
        {relationships.map((rel) => (
          <SymfonyRelationshipMethods {...rel} />
        ))}

        {/* Lifecycle callback methods */}
        {lifecycleCallbacks.map((callback) => (
          <SymfonyLifecycleMethod {...callback} />
        ))}

        {children}
      </Class>
    </>
  );
}

/**
 * Standard ID field for Symfony entities
 */
function SymfonyIdField() {
  return (
    <>
      <Attribute name="Id" />
      <Attribute name="GeneratedValue" />
      <Attribute
        name="Column"
        arguments={[{ name: "type", value: '"integer"' }]}
      />
      <Property
        name="id"
        visibility="private"
        type="?int"
        defaultValue="null"
      />
    </>
  );
}

/**
 * Symfony entity field with Doctrine attributes
 */
function SymfonyFieldProperty(props: SymfonyField) {
  const {
    name,
    type,
    length,
    nullable = false,
    unique = false,
    default: defaultValue,
    columnName,
    precision,
    scale,
  } = props;

  const namePolicy = usePhpNamePolicy();
  const propertyName = namePolicy.getName(name, "property");

  // Build column attribute arguments
  const columnArgs: Array<{ name?: string; value: string }> = [
    { name: "type", value: `"${type}"` },
  ];

  if (length) columnArgs.push({ name: "length", value: length.toString() });
  if (nullable) columnArgs.push({ name: "nullable", value: "true" });
  if (unique) columnArgs.push({ name: "unique", value: "true" });
  if (columnName && columnName !== name) {
    columnArgs.push({ name: "name", value: `"${columnName}"` });
  }
  if (precision)
    columnArgs.push({ name: "precision", value: precision.toString() });
  if (scale) columnArgs.push({ name: "scale", value: scale.toString() });

  // Determine PHP type
  let phpType = "mixed";
  switch (type) {
    case "string":
    case "text":
      phpType = nullable ? "?string" : "string";
      break;
    case "integer":
      phpType = nullable ? "?int" : "int";
      break;
    case "boolean":
      phpType = nullable ? "?bool" : "bool";
      break;
    case "datetime":
      phpType = nullable ? "?\\DateTime" : "\\DateTime";
      break;
    case "decimal":
      phpType = nullable ? "?float" : "float";
      break;
    case "json":
      phpType = nullable ? "?array" : "array";
      break;
  }

  return (
    <>
      <Attribute name="Column" arguments={columnArgs} />
      <Property
        name={propertyName}
        visibility="private"
        type={phpType}
        defaultValue={defaultValue}
      />
    </>
  );
}

/**
 * Symfony relationship property with Doctrine attributes
 */
function SymfonyRelationshipProperty(props: SymfonyRelationship) {
  const {
    name,
    type,
    targetEntity,
    mappedBy,
    inversedBy,
    joinColumn,
    joinTable,
    cascade,
    fetch,
    orphanRemoval,
  } = props;

  const namePolicy = usePhpNamePolicy();
  const propertyName = namePolicy.getName(name, "property");

  // Build relationship attribute arguments
  const relationshipArgs: Array<{ name?: string; value: string }> = [
    { name: "targetEntity", value: `${targetEntity}::class` },
  ];

  if (mappedBy)
    relationshipArgs.push({ name: "mappedBy", value: `"${mappedBy}"` });
  if (inversedBy)
    relationshipArgs.push({ name: "inversedBy", value: `"${inversedBy}"` });
  if (cascade?.length) {
    relationshipArgs.push({
      name: "cascade",
      value: `[${cascade.map((c) => `"${c}"`).join(", ")}]`,
    });
  }
  if (fetch) relationshipArgs.push({ name: "fetch", value: `"${fetch}"` });
  if (orphanRemoval)
    relationshipArgs.push({ name: "orphanRemoval", value: "true" });

  // Determine PHP type
  let phpType = "mixed";
  switch (type) {
    case "OneToOne":
    case "ManyToOne":
      phpType = `?${targetEntity}`;
      break;
    case "OneToMany":
    case "ManyToMany":
      phpType = `Collection<int, ${targetEntity}>`;
      break;
  }

  return (
    <>
      <Attribute name={type} arguments={relationshipArgs} />
      {joinColumn && (
        <Attribute
          name="JoinColumn"
          arguments={[
            { name: "name", value: `"${joinColumn.name}"` },
            ...(joinColumn.referencedColumnName ?
              [
                {
                  name: "referencedColumnName",
                  value: `"${joinColumn.referencedColumnName}"`,
                },
              ]
            : []),
          ]}
        />
      )}
      {joinTable && (
        <Attribute
          name="JoinTable"
          arguments={[{ name: "name", value: `"${joinTable.name}"` }]}
        />
      )}
      <Property name={propertyName} visibility="private" type={phpType} />
    </>
  );
}

/**
 * Getter and setter methods for Symfony entity fields
 */
function SymfonyFieldMethods(props: SymfonyField) {
  const { name, type } = props;
  const namePolicy = usePhpNamePolicy();

  const propertyName = namePolicy.getName(name, "property");
  const getterName = `get${namePolicy.getName(name, "class")}`;
  const setterName = `set${namePolicy.getName(name, "class")}`;

  // Determine return types
  let getterReturnType = "mixed";
  let setterParamType = "mixed";

  switch (type) {
    case "string":
    case "text":
      getterReturnType = "?string";
      setterParamType = "?string";
      break;
    case "integer":
      getterReturnType = "?int";
      setterParamType = "?int";
      break;
    case "boolean":
      getterReturnType = "?bool";
      setterParamType = "?bool";
      break;
    case "datetime":
      getterReturnType = "?\\DateTime";
      setterParamType = "?\\DateTime";
      break;
    case "decimal":
      getterReturnType = "?float";
      setterParamType = "?float";
      break;
    case "json":
      getterReturnType = "?array";
      setterParamType = "?array";
      break;
  }

  return (
    <>
      {/* Getter */}
      <Method
        name={getterName}
        visibility="public"
        returnType={getterReturnType}
      >
        {`return $this->${propertyName};`}
      </Method>

      {/* Setter */}
      <Method
        name={setterName}
        visibility="public"
        parameters={[{ name: "value", type: setterParamType }]}
        returnType="self"
      >
        {`$this->${propertyName} = $value;`}

        {`return $this;`}
      </Method>
    </>
  );
}

/**
 * Methods for Symfony entity relationships
 */
function SymfonyRelationshipMethods(props: SymfonyRelationship) {
  const { name, type, targetEntity } = props;
  const namePolicy = usePhpNamePolicy();

  const propertyName = namePolicy.getName(name, "property");

  if (type === "OneToOne" || type === "ManyToOne") {
    const getterName = `get${namePolicy.getName(name, "class")}`;
    const setterName = `set${namePolicy.getName(name, "class")}`;

    return (
      <>
        <Method
          name={getterName}
          visibility="public"
          returnType={`?${targetEntity}`}
        >
          {`return $this->${propertyName};`}
        </Method>

        <Method
          name={setterName}
          visibility="public"
          parameters={[{ name: "value", type: `?${targetEntity}` }]}
          returnType="self"
        >
          {`$this->${propertyName} = $value;`}

          {`return $this;`}
        </Method>
      </>
    );
  } else {
    // OneToMany or ManyToMany
    const getterName = `get${namePolicy.getName(name, "class")}`;
    const adderName = `add${namePolicy.getName(name.replace(/s$/, ""), "class")}`;
    const removerName = `remove${namePolicy.getName(name.replace(/s$/, ""), "class")}`;

    return (
      <>
        <Method
          name={getterName}
          visibility="public"
          returnType={`Collection<int, ${targetEntity}>`}
        >
          {`return $this->${propertyName};`}
        </Method>

        <Method
          name={adderName}
          visibility="public"
          parameters={[{ name: "item", type: targetEntity }]}
          returnType="self"
        >
          {`if (!$this->${propertyName}->contains($item)) {`}
          {`$this->${propertyName}->add($item);`}
          {`}`}

          {`return $this;`}
        </Method>

        <Method
          name={removerName}
          visibility="public"
          parameters={[{ name: "item", type: targetEntity }]}
          returnType="self"
        >
          {`$this->${propertyName}->removeElement($item);`}

          {`return $this;`}
        </Method>
      </>
    );
  }
}

/**
 * Symfony lifecycle callback method
 */
function SymfonyLifecycleMethod(props: SymfonyLifecycleCallback) {
  const { event, method } = props;

  return (
    <>
      <Attribute name={event} />
      <Method name={method} visibility="public" returnType="void">
        // TODO: Implement {event} logic
      </Method>
    </>
  );
}
