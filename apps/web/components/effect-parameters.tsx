"use client";

import { CharacterResourceDefinition } from "roleplayer";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

export function EffectParameters({
  resourceDefinitions,
  parameters,
}: {
  resourceDefinitions: CharacterResourceDefinition[];
  parameters: Record<string, any>;
}) {
  function renderParameterType(key: string) {
    switch (key) {
      case "variableValue":
        return "Variable";
      case "staticValue":
        return "Static";
      case "resourceTypeId":
        return "Resource";
      default:
        return key;
    }
  }

  function renderValue(key: string, value: any) {
    switch (key) {
      case "resourceTypeId":
        return resourceDefinitions.find((r) => r.id === value)?.name || "Unknown resource";
      default:
        return value;
    }
  }

  return (
    <Table>
      <TableBody>
        {Object.entries(parameters).map(([key, value]) => (
          <TableRow key={key}>
            <TableCell>{renderValue(key, value)}</TableCell>
            <TableCell>{renderParameterType(key)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
