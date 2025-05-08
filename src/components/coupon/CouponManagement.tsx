import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  Tag,
  Calendar,
} from "lucide-react";
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
import { Coupon, Tenant, Company } from "@/types/models";
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "@/lib/supabase";

interface CouponManagementProps {
  userRole?: "superadmin" | "owner" | "user";
}

const CouponManagement = ({
  userRole = "superadmin",
}: CouponManagementProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for coupons
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: "1",
      code: "WELCOME20",
      description: "Welcome discount for new users",
      discountType: "percentage",
      discountValue: 20,
      startDate: "2023-05-01",
      endDate: "2023-12-31",
      maxUses: 100,
      currentUses: 45,
      status: "active",
      tenantId: "1",
      companyId: null,
      createdAt: "2023-05-01",
      createdBy: "admin",
    },
    {
      id: "2",
      code: "SUMMER50",
      description: "Summer sale discount",
      discountType: "percentage",
      discountValue: 50,
      startDate: "2023-06-01",
      endDate: "2023-08-31",
      maxUses: 200,
      currentUses: 120,
      status: "active",
      tenantId: "1",
      companyId: "1",
      createdAt: "2023-06-01",
      createdBy: "admin",
      minPurchaseAmount: 100,
    },
    {
      id: "3",
      code: "FIXED25",
      description: "Fixed amount discount",
      discountType: "fixed",
      discountValue: 25,
      startDate: "2023-04-15",
      endDate: "2023-07-15",
      currentUses: 30,
      status: "expired",
      tenantId: "2",
      companyId: null,
      createdAt: "2023-04-15",
      createdBy: "admin",
    },
  ]);

  // Mock data for tenants and companies (for dropdown selection)
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
    },
  ]);

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Get form data
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const newCoupon: Partial<Coupon> = {
      code: formData.get("code") as string,
      description: formData.get("description") as string,
      discountType: formData.get("discountType") as "percentage" | "fixed",
      discountValue: Number(formData.get("discountValue")),
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      maxUses: Number(formData.get("maxUses")) || undefined,
      currentUses: 0,
      status: "active",
      tenantId: (formData.get("tenantId") as string) || undefined,
      companyId: (formData.get("companyId") as string) || undefined,
      createdAt: new Date().toISOString().split("T")[0],
      createdBy: "admin",
    };

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would call the API
      // createCoupon(newCoupon);
      const newId = (
        Math.max(...coupons.map((c) => Number(c.id))) + 1
      ).toString();
      setCoupons([...coupons, { ...newCoupon, id: newId } as Coupon]);
      setIsLoading(false);
      setIsAddDialogOpen(false);
    }, 1000);
  };

  const handleEditCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Get form data
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const updatedCoupon: Partial<Coupon> = {
      id: selectedCoupon?.id,
      code: formData.get("code") as string,
      description: formData.get("description") as string,
      discountType: formData.get("discountType") as "percentage" | "fixed",
      discountValue: Number(formData.get("discountValue")),
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      maxUses: Number(formData.get("maxUses")) || undefined,
      status: formData.get("status") as "active" | "inactive" | "expired",
      tenantId: (formData.get("tenantId") as string) || undefined,
      companyId: (formData.get("companyId") as string) || undefined,
    };

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would call the API
      // updateCoupon(updatedCoupon);
      setCoupons(
        coupons.map((coupon) =>
          coupon.id === selectedCoupon?.id
            ? { ...coupon, ...updatedCoupon }
            : coupon,
        ),
      );
      setIsLoading(false);
      setIsEditDialogOpen(false);
    }, 1000);
  };

  const handleDeleteCoupon = (id: string) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would call the API
      // deleteCoupon(id);
      setCoupons(coupons.filter((coupon) => coupon.id !== id));
      setIsLoading(false);
    }, 1000);
  };

  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (coupon.description &&
        coupon.description.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "expired":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="p-6 bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Coupon Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Add Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Coupon</DialogTitle>
              <DialogDescription>
                Create a new coupon code for discounts. Fill in all required
                fields.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCoupon}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="code">Coupon Code</Label>
                  <Input
                    id="code"
                    name="code"
                    placeholder="e.g., SUMMER20"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Enter description"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="discountType">Discount Type</Label>
                  <Select name="discountType" defaultValue="percentage">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="discountValue">Discount Value</Label>
                  <Input
                    id="discountValue"
                    name="discountValue"
                    type="number"
                    placeholder="Enter value"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      required
                      defaultValue={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" name="endDate" type="date" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="maxUses">Maximum Uses</Label>
                  <Input
                    id="maxUses"
                    name="maxUses"
                    type="number"
                    placeholder="Leave blank for unlimited"
                  />
                </div>

                {userRole === "superadmin" && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="tenantId">Assign to Tenant</Label>
                      <Select name="tenantId">
                        <SelectTrigger>
                          <SelectValue placeholder="Select tenant (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None (Global)</SelectItem>
                          {tenants.map((tenant) => (
                            <SelectItem key={tenant.id} value={tenant.id}>
                              {tenant.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="companyId">Assign to Company</Label>
                      <Select name="companyId">
                        <SelectTrigger>
                          <SelectValue placeholder="Select company (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {companies.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
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
                  {isLoading ? "Creating..." : "Create Coupon"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coupons</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search coupons..."
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
              <p className="text-muted-foreground">Loading coupons...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Validity</TableHead>
                  <TableHead>Uses</TableHead>
                  {userRole === "superadmin" && (
                    <TableHead>Tenant/Company</TableHead>
                  )}
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.length > 0 ? (
                  filteredCoupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-medium">
                        {coupon.code}
                      </TableCell>
                      <TableCell>{coupon.description}</TableCell>
                      <TableCell>
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue}%`
                          : `$${coupon.discountValue}`}
                      </TableCell>
                      <TableCell>
                        {formatDate(coupon.startDate)} -{" "}
                        {coupon.endDate
                          ? formatDate(coupon.endDate)
                          : "No expiry"}
                      </TableCell>
                      <TableCell>
                        {coupon.currentUses}
                        {coupon.maxUses ? `/${coupon.maxUses}` : ""}
                      </TableCell>
                      {userRole === "superadmin" && (
                        <TableCell>
                          {coupon.tenantId
                            ? tenants.find((t) => t.id === coupon.tenantId)
                                ?.name
                            : "Global"}
                          {coupon.companyId && (
                            <span className="block text-xs text-muted-foreground">
                              {
                                companies.find((c) => c.id === coupon.companyId)
                                  ?.name
                              }
                            </span>
                          )}
                        </TableCell>
                      )}
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(coupon.status)}>
                          {coupon.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog
                            open={
                              isEditDialogOpen &&
                              selectedCoupon?.id === coupon.id
                            }
                            onOpenChange={(open) => {
                              setIsEditDialogOpen(open);
                              if (open) setSelectedCoupon(coupon);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Edit Coupon</DialogTitle>
                                <DialogDescription>
                                  Update coupon information.
                                </DialogDescription>
                              </DialogHeader>
                              <form onSubmit={handleEditCoupon}>
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-code">
                                      Coupon Code
                                    </Label>
                                    <Input
                                      id="edit-code"
                                      name="code"
                                      placeholder="e.g., SUMMER20"
                                      defaultValue={selectedCoupon?.code}
                                      required
                                    />
                                  </div>

                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-description">
                                      Description
                                    </Label>
                                    <Input
                                      id="edit-description"
                                      name="description"
                                      placeholder="Enter description"
                                      defaultValue={selectedCoupon?.description}
                                    />
                                  </div>

                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-discountType">
                                      Discount Type
                                    </Label>
                                    <Select
                                      name="discountType"
                                      defaultValue={
                                        selectedCoupon?.discountType
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="percentage">
                                          Percentage (%)
                                        </SelectItem>
                                        <SelectItem value="fixed">
                                          Fixed Amount
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-discountValue">
                                      Discount Value
                                    </Label>
                                    <Input
                                      id="edit-discountValue"
                                      name="discountValue"
                                      type="number"
                                      placeholder="Enter value"
                                      defaultValue={
                                        selectedCoupon?.discountValue
                                      }
                                      required
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor="edit-startDate">
                                        Start Date
                                      </Label>
                                      <Input
                                        id="edit-startDate"
                                        name="startDate"
                                        type="date"
                                        defaultValue={selectedCoupon?.startDate}
                                        required
                                      />
                                    </div>

                                    <div className="grid gap-2">
                                      <Label htmlFor="edit-endDate">
                                        End Date
                                      </Label>
                                      <Input
                                        id="edit-endDate"
                                        name="endDate"
                                        type="date"
                                        defaultValue={selectedCoupon?.endDate}
                                      />
                                    </div>
                                  </div>

                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-maxUses">
                                      Maximum Uses
                                    </Label>
                                    <Input
                                      id="edit-maxUses"
                                      name="maxUses"
                                      type="number"
                                      placeholder="Leave blank for unlimited"
                                      defaultValue={selectedCoupon?.maxUses}
                                    />
                                  </div>

                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-status">Status</Label>
                                    <Select
                                      name="status"
                                      defaultValue={selectedCoupon?.status}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="active">
                                          Active
                                        </SelectItem>
                                        <SelectItem value="inactive">
                                          Inactive
                                        </SelectItem>
                                        <SelectItem value="expired">
                                          Expired
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {userRole === "superadmin" && (
                                    <>
                                      <div className="grid gap-2">
                                        <Label htmlFor="edit-tenantId">
                                          Assign to Tenant
                                        </Label>
                                        <Select
                                          name="tenantId"
                                          defaultValue={
                                            selectedCoupon?.tenantId || ""
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select tenant (optional)" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="">
                                              None (Global)
                                            </SelectItem>
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

                                      <div className="grid gap-2">
                                        <Label htmlFor="edit-companyId">
                                          Assign to Company
                                        </Label>
                                        <Select
                                          name="companyId"
                                          defaultValue={
                                            selectedCoupon?.companyId || ""
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select company (optional)" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="">
                                              None
                                            </SelectItem>
                                            {companies.map((company) => (
                                              <SelectItem
                                                key={company.id}
                                                value={company.id}
                                              >
                                                {company.name}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </>
                                  )}
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
                                      : "Update Coupon"}
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
                                  Delete Coupon
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this coupon?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCoupon(coupon.id)}
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
                      colSpan={userRole === "superadmin" ? 8 : 7}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No coupons found. Try adjusting your search or add a new
                      coupon.
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

export default CouponManagement;
