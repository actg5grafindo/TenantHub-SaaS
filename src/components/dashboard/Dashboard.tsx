import React from "react";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="bg-card p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-2">
          Welcome, {currentUser?.displayName || currentUser?.email || "User"}!
        </h2>
        <p className="text-muted-foreground mb-4">
          You are logged in as:{" "}
          <span className="font-medium">{currentUser?.role}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="bg-primary/10 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Your Role</h3>
            <p>{currentUser?.role}</p>
          </div>

          <div className="bg-primary/10 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Your Tenant</h3>
            <p>{currentUser?.tenantId || "Not assigned"}</p>
          </div>

          <div className="bg-primary/10 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Your Company</h3>
            <p>{currentUser?.companyId || "Not assigned"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
