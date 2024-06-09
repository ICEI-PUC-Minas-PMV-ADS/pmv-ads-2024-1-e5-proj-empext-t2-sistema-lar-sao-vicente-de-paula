import { InputDatePicker } from "@/components/input/InputDatePicker";
import { ModalDefault } from "@/components/modal/ModalDefault"
import { authToken } from "@/config/authToken";
import { PlusOutlined } from "@ant-design/icons"
import { useState } from "react";
import { useCookies } from "react-cookie";
import { Controller, useForm } from "react-hook-form";
import { IRelatorioNutricional } from "../interface/IRelatorioNutricional";
import { InputForm } from "@/components/input";
import { InputTextArea } from "@/components/input/InputTextArea";

export const CriarRegistroAntropometricoModal = ({
    
}: {

}) => {
    const [cookies] = useCookies([authToken.nome]);
    const [open, setOpen] = useState(false);

    const { handleSubmit, control, reset, watch } = useForm<IRelatorioNutricional>();
    return (
        <ModalDefault
            showFooter
            nameButtonOpenModal="Adicionar"
            iconButtonOpenModal={<PlusOutlined/>}
            titleModal="Adicionando registro Antropométrico"
            okText="Adicionar"
            width="550px"
            setOpenModal={setOpen}
            openModal={open}       
            >
            <form className="w-full flex flex-col gap-[15px]">
                    <div className="flex gap-4">
                        <Controller
                            name="data_registro_antropometrico"
                            control={control}
                            render={({
                                field: { onChange, value },
                                fieldState: { error }
                            }) => (
                                <InputDatePicker
                                    label="Data"
                                    error={error?.message}
                                    onChange={onChange}
                                    placeholder="Selicione data"    
                                />
                            )}
                        />
                        <Controller
                            name="peso_antropometrico"
                            control={control}
                            rules={{}}
                            render={({
                            field: { onChange, value },
                            fieldState: { error },
                            }) => (
                            <InputForm
                                label="Peso"
                                error={error?.message}
                                onChange={onChange}
                                value={value}
                                placeholder=""
                                suffix="kg"
                            />
                            )}
                        />
                    </div>
                    <div className="flex gap-4">
                        <Controller
                            name="edema_antropometrico"
                            control={control}
                            rules={{}}
                            render={({
                            field: { onChange, value },
                            fieldState: { error },
                            }) => (
                            <InputForm
                                label="Edema"
                                error={error?.message}
                                onChange={onChange}
                                value={value}
                                placeholder=""
                            />
                            )}
                        />
                        <Controller
                            name="ascite_antropometrico"
                            control={control}
                            rules={{}}
                            render={({
                            field: { onChange, value },
                            fieldState: { error },
                            }) => (
                            <InputForm
                                label="Ascite"
                                error={error?.message}
                                onChange={onChange}
                                value={value}
                                placeholder=""
                            />
                            )}
                        />
                    </div>
                    <div className="flex gap-4">
                        <Controller
                            name="imc_antropometrico"
                            control={control}
                            rules={{}}
                            render={({
                            field: { onChange, value },
                            fieldState: { error },
                            }) => (
                            <InputForm
                                label="IMC"
                                error={error?.message}
                                onChange={onChange}
                                value={value}
                                placeholder=""
                                suffix="kg/m²"
                            />
                            )}
                        />
                        <Controller
                            name="classificao_antropometrico"
                            control={control}
                            rules={{}}
                            render={({
                            field: { onChange, value },
                            fieldState: { error },
                            }) => (
                            <InputForm
                                label="Classificação"
                                error={error?.message}
                                onChange={onChange}
                                value={value}
                                placeholder=""
                            />
                            )}
                        />
                    </div>
                    <div className="flex gap-4">
                        <Controller
                            name="cb_antropometrico"
                            control={control}
                            rules={{}}
                            render={({
                            field: { onChange, value },
                            fieldState: { error },
                            }) => (
                            <InputForm
                                label="CB"
                                error={error?.message}
                                onChange={onChange}
                                value={value}
                                placeholder=""
                                suffix="cm"
                            />
                            )}
                        />
                        <Controller
                            name="cp_antropometrico"
                            control={control}
                            rules={{}}
                            render={({
                            field: { onChange, value },
                            fieldState: { error },
                            }) => (
                            <InputForm
                                label="CP"
                                error={error?.message}
                                onChange={onChange}
                                value={value}
                                placeholder=""
                                suffix="cm"
                            />
                            )}
                        />
                    </div>
                    <div className="">
                        <Controller
                            name="observacoes_antropometrico"
                            control={control}
                            defaultValue=""
                            rules={{}}
                            render={({
                                field: { onChange, value },
                                fieldState: { error },
                            }) => (
                                <InputTextArea
                                label="Observações"
                                error={error?.message}
                                onChange={onChange}
                                value={value}
                                placeholder=""
                                rows={4}
                                />
                            )}
                        />
                    </div>
            </form>
        </ModalDefault>
    )
}