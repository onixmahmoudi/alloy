import { Block, Scope, Show } from "@alloy-js/core";
import { usePhpNamePolicy } from "../name-policy.js";
import { Declaration, DeclarationProps } from "./Declaration.js";
import { Name } from "./Name.js";

export type TraitProps = DeclarationProps & {
  uses?: string[]; // Other traits this trait uses
};

/**
 * Represents a PHP trait declaration
 */
export function Trait(props: TraitProps) {
  const name = usePhpNamePolicy().getName(props.name, "trait");

  return (
    <Declaration {...props} name={name}>
      trait <Name>{name}</Name>
      <Block newline>
        <Show when={props.uses && props.uses.length > 0}>
          {props.uses!.map((usedTrait, index) => (
            <>
              use {usedTrait};
              <hbr />
              {index === props.uses!.length - 1 && <hbr />}
            </>
          ))}
        </Show>
        <Scope name={name} kind="trait">
          {props.children}
        </Scope>
      </Block>
    </Declaration>
  );
}
