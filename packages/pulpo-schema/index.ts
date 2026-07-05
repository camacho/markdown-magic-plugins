import type { PulpoSchema, TransformArgs } from './types.ts';

export type {
  PulpoSchema,
  PulpoSchemaProperty,
  TransformArgs,
} from './types.ts';

export type SchemaTransform = (
  schema: PulpoSchema,
) => (args: TransformArgs) => string;

const factory: SchemaTransform = (schema) => {
  return function SCHEMA({ content }: TransformArgs): string {
    const definition = schema.document();
    const keys = Object.keys(definition);

    if (keys.length === 0) return content;

    const output = keys.map((key) => {
      const option = definition[key];

      const lines = [`* **${key}** (${option.type}) - ${option.description}`];

      return lines
        .concat(
          Object.keys(option)
            .filter(
              (optionKey) => ['type', 'description'].indexOf(optionKey) === -1,
            )
            .map((optionKey) => `  * *${optionKey}* - ${option[optionKey]}`),
        )
        .join('\n');
    });

    return output.join('\n');
  };
};

export default factory;
