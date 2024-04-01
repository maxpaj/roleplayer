"use client";

import { CharacterResourceDefinition } from "roleplayer";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { StatusAggregated } from "services/data-mapper";
import Image from "next/image";
import dice from "@/assets/dice.svg";

export function EffectParameters({
  resourceDefinitions,
  statusDefinitions,
  parameters,
}: {
  resourceDefinitions: CharacterResourceDefinition[];
  statusDefinitions: StatusAggregated[];
  parameters: Record<string, any>;
}) {
  function renderParameterType(key: string) {
    switch (key) {
      case "variableValue":
        return <Image width={16} height={16} alt="Dice" src={dice} />;
      case "staticValue":
        return "Static";
      case "resourceTypeId":
        return "Resource";
      case "statusId":
        return "Status";
      default:
        return key;
    }
  }

  function renderValue(key: string, value: any) {
    switch (key) {
      case "resourceTypeId":
        return resourceDefinitions.find((r) => r.id === value)?.name || "Unknown resource";
      case "statusId":
        return statusDefinitions.find((r) => r.id === value)?.name || "Unknown status";
      default:
        return value;
    }
  }

  return (
    <Table>
      <TableBody>
        {Object.entries(parameters).map(([key, value]) => (
          <TableRow key={key}>
            <TableCell style={{ width: "50%" }}>{renderParameterType(key)}</TableCell>
            <TableCell style={{ width: "50%" }}>{renderValue(key, value)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
