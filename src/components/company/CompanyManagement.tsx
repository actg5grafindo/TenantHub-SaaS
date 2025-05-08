import React, { useState } from "react";
import { Search, Plus, Edit, Trash2, Filter, Building } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Company, Tenant } from "@/types/models";

interface CompanyManagementProps {
  userRole?: "superadmin" | "owner" | "user";
}

const CompanyManagement = ({
  userRole = "superadmin",
}: CompanyManagementProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for companies
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: "1",
      name: "Tech Solutions Inc",
      description: "IT services and consulting",
      tenantId: "1",
      tenantName: "Acme Corporation",
      createdAt: "2023-05-20",
      status: "active",
      usersCount: 12,
      industry: "Technology",
      size: "medium",
      website: "https://techsolutions.example.com",
    },
    {
      id: "2",
      name: "Global Marketing",
      description: "Marketing and advertising agency",
      tenantId: "1",
      tenantName: "Acme Corporation",
      createdAt: "2023-06-15",
      status: "active",
      usersCount: 8,
      industry: "Marketing",
      size: "small",
      website: "https://globalmarketing.example.com",
    },
    {
      id: "3",
      name: "Data Analytics Pro",
      description: "Data analysis and business intelligence",
      tenantId: "2",
      tenantName: "Tech Innovations",
      createdAt: "2023-07-05",
      status: "inactive",
      usersCount: 5,
      industry: "Data Science",
      size: "small",
      website: "https://dataanalytics.example.com",
    },
  ]);

  // Mock data for tenants (for dropdown selection)
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
  ]);

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Add company logic would go here
      setIsLoading(false);
      setIsAddDialogOpen(false);
    }, 1000);
  };

  const handleEditCompany = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Edit company logic would go here
      setIsLoading(false);
      setIsEditDialogOpen(false);
    }, 1000);
  };

  const handleDeleteCompany = (id: string) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Delete company logic would go here
      setCompanies(companies.filter((company) => company.id !== id));
      setIsLoading(false);
    }, 1000);
  };

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (company.tenantName &&
        company.tenantName.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="p-6 bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Company Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Company</DialogTitle>
              <DialogDescription>
                Create a new company in the system. Fill in all required fields.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCompany}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input id="name" placeholder="Enter company name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Enter description" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tenant">Assign to Tenant</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tenant" />
                    </SelectTrigger>
                    <SelectContent>
                      {tenants.map((tenant) => (
                        <SelectItem key={tenant.id} value={tenant.id}>
                          {tenant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input id="industry" placeholder="Enter industry" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="size">Company Size</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">
                        Small (1-50 employees)
                      </SelectItem>
                      <SelectItem value="medium">
                        Medium (51-250 employees)
                      </SelectItem>
                      <SelectItem value="large">
                        Large (251-1000 employees)
                      </SelectItem>
                      <SelectItem value="enterprise">
                        Enterprise (1000+ employees)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="Enter website URL"
                    type="url"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Company"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Companies</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
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
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p className="text-muted-foreground">Loading companies...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  {userRole === "superadmin" && <TableHead>Tenant</TableHead>}
                  <TableHead>Industry</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">
                        {company.name}
                      </TableCell>
                      <TableCell>{company.description}</TableCell>
                      {userRole === "superadmin" && (
                        <TableCell>{company.tenantName}</TableCell>
                      )}
                      <TableCell>{company.industry}</TableCell>
                      <TableCell>{company.size}</TableCell>
                      <TableCell>{company.createdAt}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            company.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {company.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{company.usersCount}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog
                            open={
                              isEditDialogOpen &&
                              selectedCompany?.id === company.id
                            }
                            onOpenChange={(open) => {
                              setIsEditDialogOpen(open);
                              if (open) setSelectedCompany(company);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Company</DialogTitle>
                                <DialogDescription>
                                  Update company information. All fields are
                                  required.
                                </DialogDescription>
                              </DialogHeader>
                              <form onSubmit={handleEditCompany}>
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-name">
                                      Company Name
                                    </Label>
                                    <Input
                                      id="edit-name"
                                      placeholder="Enter company name"
                                      defaultValue={selectedCompany?.name}
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
                                      defaultValue={
                                        selectedCompany?.description
                                      }
                                    />
                                  </div>
                                  {userRole === "superadmin" && (
                                    <div className="grid gap-2">
                                      <Label htmlFor="edit-tenant">
                                        Assign to Tenant
                                      </Label>
                                      <Select
                                        defaultValue={selectedCompany?.tenantId}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select tenant" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {tenants.map((tenant) => (
                                            <SelectItem
                                              key={tenant.id}
                                              value={tenant.id}
                                            >
                                              {tenant.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-industry">
                                      Industry
                                    </Label>
                                    <Input
                                      id="edit-industry"
                                      placeholder="Enter industry"
                                      defaultValue={selectedCompany?.industry}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-size">
                                      Company Size
                                    </Label>
                                    <Select
                                      defaultValue={selectedCompany?.size}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select size" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="small">
                                          Small (1-50 employees)
                                        </SelectItem>
                                        <SelectItem value="medium">
                                          Medium (51-250 employees)
                                        </SelectItem>
                                        <SelectItem value="large">
                                          Large (251-1000 employees)
                                        </SelectItem>
                                        <SelectItem value="enterprise">
                                          Enterprise (1000+ employees)
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-website">
                                      Website
                                    </Label>
                                    <Input
                                      id="edit-website"
                                      placeholder="Enter website URL"
                                      type="url"
                                      defaultValue={selectedCompany?.website}
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditDialogOpen(false)}
                                    disabled={isLoading}
                                  >
                                    Cancel
                                  </Button>
                                  <Button type="submit" disabled={isLoading}>
                                    {isLoading
                                      ? "Updating..."
                                      : "Update Company"}
                                  </Button>
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
                                <AlertDialogTitle>
                                  Delete Company
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this company?
                                  This action cannot be undone and will remove
                                  all associated users and data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteCompany(company.id)
                                  }
                                  className="bg-destructive text-destructive-foreground"
                                  disabled={isLoading}
                                >
                                  {isLoading ? "Deleting..." : "Delete"}
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
                      colSpan={userRole === "superadmin" ? 9 : 8}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No companies found. Try adjusting your search or add a new
                      company.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyManagement;
