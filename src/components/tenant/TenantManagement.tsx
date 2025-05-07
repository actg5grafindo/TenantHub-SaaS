import React, { useState } from "react";
import { Search, Plus, Edit, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Tenant {
  id: string;
  name: string;
  description: string;
  dataQuota: number;
  createdAt: string;
  status: "active" | "inactive";
  companiesCount: number;
}

const TenantManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  // Mock data for tenants
  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: "1",
      name: "Acme Corporation",
      description: "Global manufacturing company",
      dataQuota: 500,
      createdAt: "2023-05-15",
      status: "active",
      companiesCount: 5,
    },
    {
      id: "2",
      name: "Tech Innovations",
      description: "Software development firm",
      dataQuota: 1000,
      createdAt: "2023-06-22",
      status: "active",
      companiesCount: 3,
    },
    {
      id: "3",
      name: "Global Services",
      description: "Consulting services provider",
      dataQuota: 250,
      createdAt: "2023-07-10",
      status: "inactive",
      companiesCount: 2,
    },
  ]);

  const handleAddTenant = (e: React.FormEvent) => {
    e.preventDefault();
    // Add tenant logic would go here
    setIsAddDialogOpen(false);
  };

  const handleEditTenant = (e: React.FormEvent) => {
    e.preventDefault();
    // Edit tenant logic would go here
    setIsEditDialogOpen(false);
  };

  const handleDeleteTenant = (id: string) => {
    // Delete tenant logic would go here
    setTenants(tenants.filter((tenant) => tenant.id !== id));
  };

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-6 bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tenant Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Add Tenant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Tenant</DialogTitle>
              <DialogDescription>
                Create a new tenant in the system. Fill in all required fields.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddTenant}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Tenant Name</Label>
                  <Input id="name" placeholder="Enter tenant name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Enter description" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dataQuota">Data Quota (MB)</Label>
                  <Input
                    id="dataQuota"
                    type="number"
                    placeholder="Enter data quota"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Tenant</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tenants</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tenants..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Data Quota</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Companies</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.length > 0 ? (
                filteredTenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">{tenant.name}</TableCell>
                    <TableCell>{tenant.description}</TableCell>
                    <TableCell>{tenant.dataQuota} MB</TableCell>
                    <TableCell>{tenant.createdAt}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          tenant.status === "active" ? "default" : "secondary"
                        }
                      >
                        {tenant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{tenant.companiesCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog
                          open={
                            isEditDialogOpen && selectedTenant?.id === tenant.id
                          }
                          onOpenChange={(open) => {
                            setIsEditDialogOpen(open);
                            if (open) setSelectedTenant(tenant);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Tenant</DialogTitle>
                              <DialogDescription>
                                Update tenant information. All fields are
                                required.
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleEditTenant}>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-name">Tenant Name</Label>
                                  <Input
                                    id="edit-name"
                                    placeholder="Enter tenant name"
                                    defaultValue={selectedTenant?.name}
                                    required
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-description">
                                    Description
                                  </Label>
                                  <Input
                                    id="edit-description"
                                    placeholder="Enter description"
                                    defaultValue={selectedTenant?.description}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-dataQuota">
                                    Data Quota (MB)
                                  </Label>
                                  <Input
                                    id="edit-dataQuota"
                                    type="number"
                                    placeholder="Enter data quota"
                                    defaultValue={selectedTenant?.dataQuota}
                                    required
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setIsEditDialogOpen(false)}
                                >
                                  Cancel
                                </Button>
                                <Button type="submit">Update Tenant</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Tenant</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this tenant?
                                This action cannot be undone and will remove all
                                associated companies and user mappings.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteTenant(tenant.id)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No tenants found. Try adjusting your search or add a new
                    tenant.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantManagement;
