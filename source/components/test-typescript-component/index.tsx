import { useEffect } from "react";
import { testTypescriptFunction } from "../../utils/typescript";

interface ITestTypescriptComponentProps {
    readonly text: string;
}

const TestTypescriptComponent = ({ text }: ITestTypescriptComponentProps) => {
    useEffect(() => {
        testTypescriptFunction('1234')
    }, [])
    return <div>{text}</div>
}

export default TestTypescriptComponent
