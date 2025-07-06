"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";

export default function AdminSearch() {
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const [queryValue, setQueryValue] = useState("");

  const formActionUrl = pathname.includes("/admin/orders")
    ? "/admin/orders"
    : pathname.includes("/admin/users")
    ? "/admin/users"
    : "/admin/products";

  useEffect(
    function () {
      setQueryValue(searchParams.get("query") || "");
    },
    [searchParams]
  );
  return (
    <form action={formActionUrl} method="GET">
      <Input
        type="search"
        placeholder="Search..."
        name="query"
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value)}
        className="md:w-[100px] lg:w-[300px]"
      />
      <button className="sr-only" type="submit"></button>
    </form>
  );
}
