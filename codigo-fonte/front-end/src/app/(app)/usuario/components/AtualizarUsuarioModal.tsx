import { useMutation } from "@/utils/hooks/useMutation";
import { EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IOperationUsuario, IUsuario } from "../Interface/IUsuario";
import { useFetch } from "@/utils/hooks/useFetch";
import { queryBuilder } from "@/utils/functions/query-builder";
import { invertCPF, regexCPF } from "@/utils/regex/regexCPF";
import { InputForm, InputSelect, UploudAvatar } from "@/components/input";
import { isCPF } from "@/utils/validator/isCPF";
import { ModalDefault } from "@/components/modal/ModalDefault";
import { Select, Tooltip, UploadFile } from "antd";
import { api } from "@/utils/service/api";
import { useCookies } from "react-cookie";
import { authToken } from "@/config/authToken";
import { isNome } from "@/utils/validator/isName";
import { withoutNumber } from "@/utils/validator/withoutNumber";
import { isEmail } from "@/utils/validator/isEmail";

export const AtualizarUsuarioModal = ({
  uid,
  refetchList,
}: {
  uid: string;
  refetchList: () => void;
}) => {
  const [cookies] = useCookies([authToken.nome]);
  const [open, setOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { handleSubmit, control, reset, setValue, getValues } =
    useForm<Partial<IOperationUsuario>>();

  const { data: usuario } = useFetch<IUsuario>("/usuarios/" + uid, [uid], {
    enable: open,
    onSuccess: (data) => {
      const usuario = data.data;

      if (usuario) {
        setFileList([
          {
            url: usuario.foto,
            uid: usuario.uid,
            name: usuario.nome,
          },
        ]);

        setValue("nome", usuario.nome);
        setValue("id_cargo", usuario.id_cargo);
        setValue("email", usuario.email);
        setValue("cpf_cnh", usuario.cpf_cnh);
      }
    },
  });

  const { mutate: updateUsuario, isFetching: isUpdatingUsuario } = useMutation<
    Partial<IOperationUsuario>
  >("/usuarios/" + uid, {
    method: "patch",
    messageSucess: "Usuário atualizado com sucesso!",
    onSuccess: async () => {
      const formData = new FormData();

      if (fileList.length > 0 && fileList[0] && fileList[0].originFileObj) {
        await formData.append("foto", fileList[0]?.originFileObj);
        await api
          .post("/usuarios/" + uid + "/upload-foto", formData, {
            headers: {
              Authorization: "Bearer " + cookies[authToken.nome],
              "content-type": "multipart/form-data",
            },
          })
          .then(() => {
            refetchList();
            setOpen(false);
          });
      } else {
        refetchList();
        setOpen(false);
      }
    },
  });

  const { mutate: redefirSenha } = useMutation<{ email: string }>(
    "/auth/redefinir-senha",
    {
      method: "post",
      messageSucess: "E-mail de redefinição de senha enviado para o usuário!",
      onSuccess: () => {
        setOpen(false);
      },
    }
  );

  const { data: cargos } = useFetch<
    { id: number; uid: string; nome: string }[]
  >("/cargos", ["cargos_lista"], {
    enable: open,
    params: queryBuilder({
      page_limit: 999999,
    }),
  });

  return (
    <ModalDefault
      customButtonOpenModal={
        <Tooltip title={"Editar"}>
          <button
            onClick={() => setOpen(true)}
            className="text-black/30 hover:text-primaria h-full w-[50px]"
          >
            <EditOutlined className={"text-[18px]"} />
          </button>
        </Tooltip>
      }
      titleModal={"Editando usuário"}
      okText="Salvar"
      onSubmit={handleSubmit(updateUsuario)}
      isFetching={isUpdatingUsuario}
      width="700px"
      setOpenModal={setOpen}
      openModal={open}
      listOptions={[
        {
          label: "Redefinir senha",
          onClick: () => redefirSenha({ email: getValues("email") || "" }),
        },
        {
          label: usuario?.situacao === "ATIVO" ? "Inativar" : "Reativar",
          onClick: () =>
            updateUsuario({
              situacao: usuario?.situacao === "ATIVO" ? "INATIVO" : "ATIVO",
            }),
        },
      ]}
      situation={usuario?.situacao}
      created_item={usuario?.criado_em}
      updated_item={usuario?.atualizado_em}
    >
      <form className="w-full flex flex-col gap-[15px]">
        <div className="flex items-center gap-[15px]">
          <div className="w-[140px] h-[100px] flex items-center">
            <Controller
              name="foto"
              control={control}
              render={() => (
                <UploudAvatar fileList={fileList} setFileList={setFileList} />
              )}
            />
          </div>
          <Controller
            name="nome"
            control={control}
            defaultValue=""
            rules={{
              required: "Insira o nome do usuário",
              validate: (value) => {
                if (value && isNome(value)) return "Preencher o nome completo";
                if (value && withoutNumber(value))
                  return "Nome não pode conter números";
                return true;
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <InputForm
                label="Nome"
                required
                error={error?.message}
                onChange={onChange}
                value={value}
                placeholder="Maria da Silva"
              />
            )}
          />
        </div>
        <div className="flex justify-between gap-4">
          <Controller
            name="cpf_cnh"
            control={control}
            rules={{
              required: "Insira o CPF do usuário",
              validate: (value) => {
                if (value && !isCPF(value)) return "Formato inválido do CPF";
                return true;
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <InputForm
                label="CPF"
                required
                error={error?.message}
                onChange={(e) => {
                  onChange(invertCPF(e.target.value));
                }}
                value={value && regexCPF(value)}
                placeholder="000.000.000-00"
              />
            )}
          />
          <Controller
            name="id_cargo"
            control={control}
            rules={{ required: "Insira um cargo para o usuário" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <InputSelect
                tooltip="O cargo irá definir as permissões que o usuário terá no sistema."
                label="Cargo"
                onChange={onChange}
                error={error?.message}
                required
                placeholder="Selecionar"
                value={value}
              >
                {cargos?.map((cargo) => (
                  <Select.Option key={cargo.uid} value={cargo.id}>
                    {cargo.nome}
                  </Select.Option>
                ))}
              </InputSelect>
            )}
          />
        </div>

        <Controller
          name="email"
          control={control}
          rules={{
            required: "Insira o e-mail do usuário",
            validate: (value) => {
              if (value && !isEmail(value)) return "Formato inválido do E-mail";
              return true;
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputForm
              label="E-mail"
              required
              error={error?.message}
              onChange={onChange}
              value={value}
              placeholder="maria@mail.com"
            />
          )}
        />
      </form>
    </ModalDefault>
  );
};
