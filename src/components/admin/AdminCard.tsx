
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface AdminCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
}

const AdminCard: React.FC<AdminCardProps> = ({ title, description, icon, to }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(to);
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          {icon}
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default AdminCard;
