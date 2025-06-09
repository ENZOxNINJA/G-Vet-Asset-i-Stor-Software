import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { assetFormSchema } from "@shared/schema";
import { Calendar, FileText, Package, User, Building, Truck } from "lucide-react";
import { format } from "date-fns";
import AppLayout from "@/components/SeparatedAppLayout";

// KEW.PA Asset Categories based on Malaysian Government standards
const assetCategories = [
  "Peralatan dan Kelengkapan ICT", // ICT Equipment and Accessories
  "Perabot", // Furniture
  "Kenderaan", // Vehicles
  "Mesin dan Jentera", // Machinery and Equipment
  "Peralatan Elektrik", // Electrical Equipment
  "Peralatan Komunikasi", // Communication Equipment
  "Peralatan Saintifik", // Scientific Equipment
  "Lain-lain", // Others
];

const subCategories = [
  "Komputer", // Computer
  "Printer", // Printer
  "Meja", // Table
  "Kerusi", // Chair
  "Kereta", // Car
  "Motosikal", // Motorcycle
  "Lori", // Truck
  "Telefon", // Phone
  "Faks", // Fax
];

const acquisitionMethods = [
  "Pembelian", // Purchase
  "Hibah", // Grant/Gift
  "Sewa Beli", // Hire Purchase
  "Pemindahan", // Transfer
  "Pinjaman", // Loan
  "Lain-lain", // Others
];

const assetOrigins = [
  "Tempatan", // Local
  "Luar Negara", // Foreign
];

const AssetRegistrationKEWPA = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");

  // Set up form with react-hook-form for KEW.PA compliance
  const form = useForm({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      registrationNumber: "",
      nationalCode: "",
      name: "",
      assetTag: "",
      category: "",
      subCategory: "",
      type: "",
      brand: "",
      model: "",
      origin: "",
      engineType: "",
      chassisNumber: "",
      vehicleRegistration: "",
      warrantyPeriod: "",
      originalPrice: "",
      currentValue: "",
      acquisitionMethod: "",
      acquisitionDate: format(new Date(), "yyyy-MM-dd"),
      receivedDate: format(new Date(), "yyyy-MM-dd"),
      purchaseOrderNumber: "",
      deliveryOrderNumber: "",
      supplierName: "",
      supplierAddress: "",
      location: "",
      department: "",
      division: "",
      status: "active",
      condition: "good",
      assetType: "capital",
      specifications: "",
      notes: "",
      description: "",
    },
  });

  // Create new asset mutation
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      // Transform form data to match API expectations
      const assetData = {
        ...data,
        originalPrice: parseFloat(data.originalPrice),
        currentValue: data.currentValue ? parseFloat(data.currentValue) : null,
      };
      const response = await apiRequest('POST', '/api/assets', assetData);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Asset registered successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/assets'] });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to register asset.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    createMutation.mutate(data);
  };

  const isPending = createMutation.isPending;

  return (
    <AppLayout>
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">KEW.PA-3: Daftar Harta Modal</h1>
          <p className="text-muted-foreground">
            Asset Registration Form - Malaysian Government Asset Management System
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="details" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Asset Details
                </TabsTrigger>
                <TabsTrigger value="acquisition" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Acquisition
                </TabsTrigger>
                <TabsTrigger value="location" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Location & Status
                </TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Maklumat Asas (Basic Information)</CardTitle>
                    <CardDescription>
                      Enter the basic identification details for the asset
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Registration Number */}
                    <FormField
                      control={form.control}
                      name="registrationNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>No. Siri Pendaftaran *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. ICT/2024/001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* National Code */}
                    <FormField
                      control={form.control}
                      name="nationalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>No. Kod Nasional *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 5610170300000000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Asset Name */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Keterangan Aset *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Meja Tulis Kayu 2 Warna" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Asset Tag */}
                    <FormField
                      control={form.control}
                      name="assetTag"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Asset Tag *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. AST-2024-001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Category */}
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kategori *</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih kategori" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {assetCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Sub Category */}
                    <FormField
                      control={form.control}
                      name="subCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sub-kategori</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih sub-kategori" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subCategories.map((subCat) => (
                                <SelectItem key={subCat} value={subCat}>
                                  {subCat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Asset Type */}
                    <FormField
                      control={form.control}
                      name="assetType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jenis Aset *</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih jenis aset" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="capital">Harta Modal</SelectItem>
                              <SelectItem value="low-value">Aset Bernilai Rendah</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Asset Details Tab */}
              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Butiran Aset (Asset Details)</CardTitle>
                    <CardDescription>
                      Detailed specifications and technical information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Type/Brand/Model */}
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jenis/Jenama/Model *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Desktop/HP/L1506" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Brand */}
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jenama</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. HP, Dell, Toyota" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Model */}
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. L1506, Vios, ProBook" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Origin */}
                    <FormField
                      control={form.control}
                      name="origin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Buatan</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih asal buatan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {assetOrigins.map((origin) => (
                                <SelectItem key={origin} value={origin}>
                                  {origin}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Engine Type */}
                    <FormField
                      control={form.control}
                      name="engineType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jenis Dan No. Enjin</FormLabel>
                          <FormControl>
                            <Input placeholder="For vehicles only" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Chassis Number */}
                    <FormField
                      control={form.control}
                      name="chassisNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>No. Casis/Siri Pembuat</FormLabel>
                          <FormControl>
                            <Input placeholder="Serial number or chassis number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Vehicle Registration */}
                    <FormField
                      control={form.control}
                      name="vehicleRegistration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>No. Pendaftaran (Kenderaan)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. WYT 3721" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Warranty Period */}
                    <FormField
                      control={form.control}
                      name="warrantyPeriod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tempoh Jaminan</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 2 tahun, 36 bulan" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Specifications */}
                    <FormField
                      control={form.control}
                      name="specifications"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Spesifikasi</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Technical specifications and details" 
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Acquisition Tab */}
              <TabsContent value="acquisition" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Maklumat Perolehan (Acquisition Information)</CardTitle>
                    <CardDescription>
                      Purchase and supplier information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Original Price */}
                    <FormField
                      control={form.control}
                      name="originalPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Harga Perolehan Asal (RM) *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              placeholder="0.00" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Current Value */}
                    <FormField
                      control={form.control}
                      name="currentValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nilai Semasa (RM)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              placeholder="0.00" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Acquisition Method */}
                    <FormField
                      control={form.control}
                      name="acquisitionMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cara Aset Diperolehi *</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih cara perolehan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {acquisitionMethods.map((method) => (
                                <SelectItem key={method} value={method}>
                                  {method}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Acquisition Date */}
                    <FormField
                      control={form.control}
                      name="acquisitionDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tarikh Perolehan *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Received Date */}
                    <FormField
                      control={form.control}
                      name="receivedDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tarikh Diterima *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Purchase Order Number */}
                    <FormField
                      control={form.control}
                      name="purchaseOrderNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>No. Pesanan Rasmi Kerajaan/Kontrak</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. PK/2024/001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Delivery Order Number */}
                    <FormField
                      control={form.control}
                      name="deliveryOrderNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nota Hantaran (DO)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. DO/2024/001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Supplier Name */}
                    <FormField
                      control={form.control}
                      name="supplierName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Pembekal</FormLabel>
                          <FormControl>
                            <Input placeholder="Supplier company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Supplier Address */}
                    <FormField
                      control={form.control}
                      name="supplierAddress"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Alamat Pembekal</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Complete supplier address" 
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Location & Status Tab */}
              <TabsContent value="location" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Lokasi Dan Status (Location & Status)</CardTitle>
                    <CardDescription>
                      Current location and status information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Department */}
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kementerian/Jabatan</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Perbendaharaan Malaysia" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Division */}
                    <FormField
                      control={form.control}
                      name="division"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bahagian/Cawangan</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Bahagian ICT" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Location */}
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lokasi</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Bilik Server, Tingkat 3" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Status */}
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Aktif</SelectItem>
                              <SelectItem value="maintenance">Penyelenggaraan</SelectItem>
                              <SelectItem value="disposed">Dilupuskan</SelectItem>
                              <SelectItem value="transferred">Dipindahkan</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Condition */}
                    <FormField
                      control={form.control}
                      name="condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Keadaan</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih keadaan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="good">Baik</SelectItem>
                              <SelectItem value="fair">Sederhana</SelectItem>
                              <SelectItem value="poor">Kurang Baik</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Keterangan</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Additional description or remarks" 
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Notes */}
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Catatan</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Internal notes and comments" 
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isPending}
              >
                Reset Form
              </Button>
              <Button type="submit" disabled={isPending} className="min-w-[120px]">
                {isPending ? "Registering..." : "Register Asset"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AppLayout>
  );
};

export default AssetRegistrationKEWPA;