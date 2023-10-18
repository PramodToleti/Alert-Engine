import { PolicyData } from "@/types/types"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism"

interface Props {
  data: PolicyData
}

const Editor = ({ data }: Props) => {
  return (
    <div className="md:w-2/5 md:absolute top-28 right-10 lg:right-24">
      <SyntaxHighlighter language="json" style={darcula}>
        {JSON.stringify(data, null, 2)}
      </SyntaxHighlighter>
    </div>
  )
}

export default Editor
