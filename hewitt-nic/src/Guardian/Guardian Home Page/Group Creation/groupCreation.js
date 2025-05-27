import { Modal, Select, Form, Input, Button, Divider, InputNumber } from "antd"
import { useEffect, useImperativeHandle, useState } from "react"

// Component to handle group creation
//  Used in modal on guardian home page
const GroupCreation = ({active, setActive, competitions, submitFunc}) => {

    // From https://stackoverflow.com/questions/74751557/add-new-form-item-to-antd-dynamic-form-list-outside-of-the-form 
    const [groupForm] = Form.useForm()

    return (
        <Modal
            title="Create New Group"
            open={active}
            onCancel={() => {setActive(false)}}
            footer = {null}
        >
            <Form
                name="group_creation"
                onFinish={async (inputs) => {
                    let res = await submitFunc(inputs)

                    if (res != false) {
                       groupForm.resetFields()  
                    }
                }}
                form={groupForm}
            >
                <Form.Item
                    name="group_title"
                    label="Project Title" 
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="sel_comp"
                    label="Select Competition" 
                    rules={[{ required: true }]}
                >
                    <Select 
                        options={competitions.map((comp) => {
                            return {value: comp.id, label: comp.name}
                        })}
                    />
                </Form.Item>

                {/*
                    Form list info from:
                        https://ant.design/components/form#form-demo-dynamic-form-item 
                        https://codesandbox.io/p/sandbox/antd-form-list-multiple-formitem-dynamic-fields-cje76?file=%2Fsrc%2FDynamicField.js%3A21%2C27 
                */}
                <Form.List 
                    name="participants"
                >
                    {(fields, { add, remove }) => {
                        return (
                            <>
                                {fields.map((field, index) => (
                                    <div key={field.key}>
                                        <Divider> Participant {index + 1} </Divider>
                                        <Form.Item
                                            name={[index, "firstname"]}
                                            label="First Name"
                                            rules={[{ required: true }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name={[index, "familyname"]}
                                            label="Family Name"
                                            rules={[{ required: true }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name={[index, "pronouns"]}
                                            label="Pronouns"
                                            rules={[{ required: true }]}
                                        >
                                            <Select 
                                                options={[
                                                    {value: "He/Him", label:"He/Him"},
                                                    {value: "She/Her", label:"She/Her"},
                                                    {value: "They/Them", label:"They/Them"},
                                                    {value: "Other", label:"Other"},
                                                ]}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name={[index, "grade"]}
                                            label="Grade"
                                            rules={[{ required: true }]}
                                        >
                                            <InputNumber 
                                                min={0} max={12}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name={[index, "age"]}
                                            label="Age"
                                        >
                                            <InputNumber 
                                                min={5} max={18}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name={[index, "school"]}
                                            label="School"
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name={[index, "address"]}
                                            label="Address"
                                        >
                                            <Input />
                                        </Form.Item>
                                        {fields.length > 1 && 
                                            <Button
                                                type="dashed"
                                                onClick={() => remove(field.name)}
                                            >
                                                Remove Participant
                                            </Button>
                                        }
                                    </div>
                                ))}
                                <Divider/>
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                    >
                                        Add Participant
                                    </Button>
                                </Form.Item>
                            </>
                        )
                    }}
                </Form.List>
                <Form.Item label={null}>
                    <Button 
                        type="primary" htmlType="submit"
                    >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default GroupCreation