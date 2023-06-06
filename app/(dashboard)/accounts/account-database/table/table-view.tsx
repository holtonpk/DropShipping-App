"use client";
import React, { useState } from "react";
// import { DataTable } from "@/components/account-table";
import FilterBuilder from "@/components/filter-builder";
import Sort from "@/components/sort-results";
import DisplaySelector from "@/components/display-selector";
import { DataSearch } from "@/components/data-search";
import AppliedFilters from "@/components/applied-filters";
import { Icons } from "@/components/icons";
import { accountDatabaseConfig } from "@/config/dashboard";
import EmptySearch from "@/components/empty-search";
import useData from "@/lib/hooks/use-account-data";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { AccountCard } from "@/components/ui/account-card";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./columns";
import { DataTablePagination } from "@/components/table/data-table-pagination";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { AccountDataType } from "@/types";

import { AccountCardPagination } from "@/components/account-card-pagination";
// Simulate a database read for tasks.

const TableView = ({
  data,
  displayType,
  setDisplayType,
}: {
  data: AccountDataType[];
  displayType: "grid" | "columns";
  setDisplayType: React.Dispatch<React.SetStateAction<"grid" | "columns">>;
}) => {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const sortOptions = accountDatabaseConfig.sortOptions;

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <>
      <div className="flex md:flex-row flex-col gap-2 w-full ">
        <form className=" bg-background rounded-md relative w-full h-fit ">
          <Icons.search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
          <Input
            placeholder="Search an user name. ex: @username"
            type="search"
            className=" w-full sm:pr-12 pl-10  text-primary"
            value={
              (table.getColumn("uniqueId")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("uniqueId")?.setFilterValue(event.target.value)
            }
          />
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="whitespace-nowrap">
              Sort by
              <Icons.chevronDown className={`ml-8 h-6 w-6 transition-all`} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {sortOptions.items.map((column) => {
              const Icon = Icons[column.icon as keyof typeof Icons];
              return (
                <DropdownMenuCheckboxItem
                  key={column.title}
                  className="capitalize"
                  checked={((column) =>
                    !!table.getColumn(column)?.getIsSorted())(column.value)}
                  onCheckedChange={() =>
                    table.getColumn(column.value)?.toggleSorting(true)
                  }
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {column.title}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Columns</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>

        <DisplaySelector
          displayType={displayType}
          setDisplayType={setDisplayType}
        />
      </div>

      <div className="w-full mt-2  ">
        <div className="space-y-4 w-full">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <DataTablePagination table={table} />
        </div>
      </div>
    </>
  );
};

export default TableView;
