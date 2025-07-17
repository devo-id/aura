import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-6xl font-bold mb-4 text-destructive">404</h1>
      <p className="text-xl font-semibold mb-2">Page Not Found</p>
      <p className="text-muted-foreground mb-6">
        The page you're looking for doesn't exist.
      </p>
      <Button onClick={() => navigate("/")}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Go back home
      </Button>
    </div>
  );
};

export default NotFound;
