import { Children, Show } from "@alloy-js/core";
import { Class, Method, Property } from "../components/index.js";
import { usePhpNamePolicy } from "../name-policy.js";

export interface LaravelModelProps {
  /** Model name */
  name: string;
  /** Database table name */
  table?: string;
  /** Primary key field */
  primaryKey?: string;
  /** Whether to use timestamps */
  timestamps?: boolean;
  /** Fillable fields */
  fillable?: string[];
  /** Hidden fields */
  hidden?: string[];
  /** Casts */
  casts?: Record<string, string>;
  /** Relationships */
  relationships?: LaravelRelationship[];
  /** Scopes */
  scopes?: LaravelScope[];
  /** Accessors */
  accessors?: LaravelAccessor[];
  /** Mutators */
  mutators?: LaravelMutator[];
  /** Additional properties */
  additionalProperties?: Array<{
    name: string;
    value: string;
    visibility?: "public" | "protected" | "private";
  }>;
  /** Children components */
  children?: Children;
}

export interface LaravelRelationship {
  name: string;
  type:
    | "hasOne"
    | "hasMany"
    | "belongsTo"
    | "belongsToMany"
    | "morphTo"
    | "morphOne"
    | "morphMany";
  relatedModel: string;
  foreignKey?: string;
  localKey?: string;
  pivotTable?: string;
}

export interface LaravelScope {
  name: string;
  parameters?: Array<{ name: string; type?: string }>;
  body: string;
}

export interface LaravelAccessor {
  attribute: string;
  returnType?: string;
  body: string;
}

export interface LaravelMutator {
  attribute: string;
  valueType?: string;
  body: string;
}

/**
 * Generates a Laravel Eloquent model
 */
export function LaravelModel(props: LaravelModelProps) {
  const {
    name,
    table,
    primaryKey = "id",
    timestamps = true,
    fillable = [],
    hidden = [],
    casts = {},
    relationships = [],
    scopes = [],
    accessors = [],
    mutators = [],
    additionalProperties = [],
    children,
  } = props;

  const namePolicy = usePhpNamePolicy();
  const className = namePolicy.getName(name, "class");

  return (
    <Class name={className} extends="Model">
      {/* Table name */}
      <Show when={table && table !== namePolicy.getName(name, "variable")}>
        <Property
          name="table"
          visibility="protected"
          type="string"
          defaultValue={`"${table}"`}
        />
      </Show>

      {/* Primary key */}
      <Show when={primaryKey !== "id"}>
        <Property
          name="primaryKey"
          visibility="protected"
          type="string"
          defaultValue={`"${primaryKey}"`}
        />
      </Show>

      {/* Timestamps */}
      <Show when={!timestamps}>
        <Property
          name="timestamps"
          visibility="public"
          type="bool"
          defaultValue="false"
        />
      </Show>

      {/* Fillable */}
      <Show when={fillable.length > 0}>
        <Property
          name="fillable"
          visibility="protected"
          type="array"
          defaultValue={`[${fillable.map((f) => `"${f}"`).join(", ")}]`}
        />
      </Show>

      {/* Hidden */}
      <Show when={hidden.length > 0}>
        <Property
          name="hidden"
          visibility="protected"
          type="array"
          defaultValue={`[${hidden.map((h) => `"${h}"`).join(", ")}]`}
        />
      </Show>

      {/* Casts */}
      <Show when={Object.keys(casts).length > 0}>
        <Property
          name="casts"
          visibility="protected"
          type="array"
          defaultValue={`[${Object.entries(casts)
            .map(([key, value]) => `"${key}" => "${value}"`)
            .join(", ")}]`}
        />
      </Show>

      {/* Additional properties */}
      {additionalProperties.map((prop) => (
        <Property
          key={prop.name}
          name={prop.name}
          visibility={prop.visibility || "protected"}
          defaultValue={prop.value}
        />
      ))}

      {/* Relationships */}
      {relationships.map((rel) => (
        <LaravelRelationshipMethod key={rel.name} {...rel} />
      ))}

      {/* Scopes */}
      {scopes.map((scope) => (
        <LaravelScopeMethod key={scope.name} {...scope} />
      ))}

      {/* Accessors */}
      {accessors.map((accessor) => (
        <LaravelAccessorMethod key={accessor.attribute} {...accessor} />
      ))}

      {/* Mutators */}
      {mutators.map((mutator) => (
        <LaravelMutatorMethod key={mutator.attribute} {...mutator} />
      ))}

      {children}
    </Class>
  );
}

/**
 * Laravel relationship method
 */
function LaravelRelationshipMethod(props: LaravelRelationship) {
  const { name, type, relatedModel, foreignKey, localKey, pivotTable } = props;
  const namePolicy = usePhpNamePolicy();

  let methodBody = `return $this->${type}(${relatedModel}::class`;

  if (foreignKey) {
    methodBody += `, "${foreignKey}"`;
  }
  if (localKey) {
    methodBody += `, "${localKey}"`;
  }
  if (pivotTable && type === "belongsToMany") {
    methodBody += `, "${pivotTable}"`;
  }

  methodBody += ");";

  return (
    <Method
      name={namePolicy.getName(name, "method")}
      visibility="public"
      returnType={getRelationshipReturnType(type)}
    >
      {methodBody}
    </Method>
  );
}

/**
 * Laravel scope method
 */
function LaravelScopeMethod(props: LaravelScope) {
  const { name, parameters = [], body } = props;
  const namePolicy = usePhpNamePolicy();

  const methodName = `scope${namePolicy.getName(name, "class")}`;
  const allParams = [{ name: "query", type: "Builder" }, ...parameters];

  return (
    <Method
      name={methodName}
      visibility="public"
      parameters={allParams}
      returnType="Builder"
    >
      {body}
    </Method>
  );
}

/**
 * Laravel accessor method
 */
function LaravelAccessorMethod(props: LaravelAccessor) {
  const { attribute, returnType, body } = props;
  const namePolicy = usePhpNamePolicy();

  const methodName = `get${namePolicy.getName(attribute, "class")}Attribute`;

  return (
    <Method
      name={methodName}
      visibility="public"
      parameters={[{ name: "value", type: "mixed" }]}
      returnType={returnType || "mixed"}
    >
      {body}
    </Method>
  );
}

/**
 * Laravel mutator method
 */
function LaravelMutatorMethod(props: LaravelMutator) {
  const { attribute, valueType, body } = props;
  const namePolicy = usePhpNamePolicy();

  const methodName = `set${namePolicy.getName(attribute, "class")}Attribute`;

  return (
    <Method
      name={methodName}
      visibility="public"
      parameters={[{ name: "value", type: valueType || "mixed" }]}
      returnType="void"
    >
      {body}
    </Method>
  );
}

/**
 * Get Laravel relationship return type
 */
function getRelationshipReturnType(type: string): string {
  switch (type) {
    case "hasOne":
    case "belongsTo":
    case "morphTo":
    case "morphOne":
      return "HasOne|BelongsTo|MorphTo|MorphOne";
    case "hasMany":
    case "morphMany":
      return "HasMany|MorphMany";
    case "belongsToMany":
      return "BelongsToMany";
    default:
      return "mixed";
  }
}

export interface LaravelControllerProps {
  /** Controller name */
  name: string;
  /** Resource controller */
  resource?: boolean;
  /** API controller */
  api?: boolean;
  /** Model name for resource controller */
  model?: string;
  /** Custom actions */
  actions?: Array<{
    name: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    parameters?: Array<{ name: string; type?: string }>;
    returnType?: string;
    body?: string;
  }>;
  /** Children components */
  children?: Children;
}

/**
 * Generates a Laravel controller
 */
export function LaravelController(props: LaravelControllerProps) {
  const {
    name,
    resource = false,
    api = false,
    model,
    actions = [],
    children,
  } = props;

  const namePolicy = usePhpNamePolicy();
  const className = namePolicy.getName(name, "class");
  const baseClass = api ? "ApiController" : "Controller";

  return (
    <Class name={className} extends={baseClass}>
      {resource && model && (
        <>
          <LaravelResourceMethod action="index" model={model} />
          <LaravelResourceMethod action="store" model={model} />
          <LaravelResourceMethod action="show" model={model} />
          <LaravelResourceMethod action="update" model={model} />
          <LaravelResourceMethod action="destroy" model={model} />
          {!api && (
            <>
              <LaravelResourceMethod action="create" model={model} />
              <LaravelResourceMethod action="edit" model={model} />
            </>
          )}
        </>
      )}

      {actions.map((action) => (
        <Method
          key={action.name}
          name={action.name}
          visibility="public"
          parameters={action.parameters}
          returnType={action.returnType}
        >
          {action.body || `// TODO: Implement ${action.name} action`}
        </Method>
      ))}

      {children}
    </Class>
  );
}

/**
 * Laravel resource method
 */
function LaravelResourceMethod(props: { action: string; model: string }) {
  const { action, model } = props;
  const namePolicy = usePhpNamePolicy();

  const modelVariable = namePolicy.getName(model, "variable");
  const modelClass = namePolicy.getName(model, "class");

  let parameters: Array<{ name: string; type?: string }> = [];
  let body = "";

  switch (action) {
    case "index":
      body = `return ${modelClass}::all();`;
      break;
    case "store":
      parameters = [{ name: "request", type: "Request" }];
      body = `return ${modelClass}::create($request->validated());`;
      break;
    case "show":
      parameters = [{ name: modelVariable, type: modelClass }];
      body = `return $${modelVariable};`;
      break;
    case "update":
      parameters = [
        { name: "request", type: "Request" },
        { name: modelVariable, type: modelClass },
      ];
      body = `$${modelVariable}->update($request->validated());\nreturn $${modelVariable};`;
      break;
    case "destroy":
      parameters = [{ name: modelVariable, type: modelClass }];
      body = `$${modelVariable}->delete();\nreturn response()->noContent();`;
      break;
    case "create":
      body = `return view('${modelVariable}.create');`;
      break;
    case "edit":
      parameters = [{ name: modelVariable, type: modelClass }];
      body = `return view('${modelVariable}.edit', compact('${modelVariable}'));`;
      break;
  }

  return (
    <Method name={action} visibility="public" parameters={parameters}>
      {body}
    </Method>
  );
}
