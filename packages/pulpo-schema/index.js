export default function factory(schema) {
  return function SCHEMA({ content }) {
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
}
