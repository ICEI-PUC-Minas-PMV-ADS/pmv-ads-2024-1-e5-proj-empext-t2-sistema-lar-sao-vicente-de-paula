"use client";

import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useFetch } from "@/utils/hooks/useFetch";
import { useState } from "react";
import { queryBuilder } from "@/utils/functions/query-builder";
import { Filter } from "@/interface/IQuery";
import { ColumnsType } from "antd/es/table";
import { TableDefault } from "@/components/table/TableDefault";
import { IModeloRelatorioPia } from "./Interface/IModeloRelatorioPia";
import { CriarModeloPiaModal } from "./Interface/components/CriarModeloPiaModal";

export default function ModeloPia() {
  const [pageLimit, setPageLimit] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pesquisa, setPesquisa] = useState<string>("");

  let filtros: Filter | undefined = new Array();

  if (pesquisa !== "")
    filtros.push({
      path: "nome",
      operator: "contains",
      value: pesquisa,
      insensitive: true,
    });

  const { data, totalCount, refetch } = useFetch<IModeloRelatorioPia[]>(
    "/modelo-relatorio-pia",
    [pesquisa, pageLimit, currentPage],
    {
      params: queryBuilder({
        page_limit: pageLimit,
        page_number: currentPage,
        filter: filtros,
        sort: [{ field: "criado_em", criteria: "desc" }],
      }),
    }
  );

  const columns: ColumnsType<IModeloRelatorioPia> = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
    },
  ];

  return (
    <div className="flex flex-col gap-[15px] mt-8">
      <div className="flex gap-5">
        <CriarModeloPiaModal refetchList={refetch} />
        <Input
          placeholder="Buscar"
          size="large"
          onChange={(e) => setPesquisa(e.target.value)}
          suffix={<SearchOutlined className="cursor-pointer opacity-50" />}
        />
      </div>
      <TableDefault
        dataSource={data}
        columns={columns}
        pagination
        totalCount={totalCount}
        setPageLimit={setPageLimit}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
