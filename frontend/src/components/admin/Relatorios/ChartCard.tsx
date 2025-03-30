import { Card, CardHeader, Button, Menu, MenuHandler, MenuList, MenuItem, Typography } from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Chart from "react-apexcharts";
import { ChartCardProps } from "../../../types/ChartCardProps";

export function ChartCard({ title, value, chart, periodo, onPeriodoChange }: ChartCardProps) {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800 w-full h-fit">
      <CardHeader
        floated={false}
        shadow={false}
        className="flex items-start justify-between rounded-none dark:bg-gray-800"
      >
        <div>
          <Typography
            variant="small"
            className="text-gray-600 dark:text-gray-300 font-medium mb-1"
          >
            {title}
          </Typography>
          <Typography 
            variant="h3" 
            className="text-blue-gray-900 dark:text-white"
          >
            {value}
          </Typography>
        </div>
        <Menu>
          <MenuHandler>
            <Button
              size="sm"
              variant="outlined"
              className="flex items-center gap-1 border-gray-300 dark:border-gray-600 dark:text-gray-300"
            >
              {periodo === 7 ? "Últimos 7 dias" : periodo === 30 ? "Últimos 30 dias" : "Últimos 90 dias"}
              <ChevronDownIcon
                strokeWidth={4}
                className="w-3 h-3 text-gray-900 dark:text-gray-300"
              />
            </Button>
          </MenuHandler>
          <MenuList className="dark:bg-gray-700 dark:border-gray-600">
            <MenuItem 
              className="dark:text-gray-300 dark:hover:bg-gray-600"
              onClick={() => onPeriodoChange(7)}
            >
              Últimos 7 dias
            </MenuItem>
            <MenuItem 
              className="dark:text-gray-300 dark:hover:bg-gray-600"
              onClick={() => onPeriodoChange(30)}
            >
              Últimos 30 dias
            </MenuItem>
            <MenuItem 
              className="dark:text-gray-300 dark:hover:bg-gray-600"
              onClick={() => onPeriodoChange(90)}
            >
              Últimos 90 dias
            </MenuItem>
          </MenuList>
        </Menu>
      </CardHeader>
      <Chart {...chart} />
    </Card>
  );
}