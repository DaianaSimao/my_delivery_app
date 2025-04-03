import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { MetricCardProps } from "../../../types/MetricCardProps";

export const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, description }) => {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
      <CardBody className="p-4">
        <img src={icon} className="h-8 w-8 mb-3 dark:filter dark:invert" alt={title} />
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
        <Typography 
          variant="small" 
          className="text-gray-500 dark:text-gray-400"
        >
          {description}
        </Typography>
      </CardBody>
    </Card>
  );
};