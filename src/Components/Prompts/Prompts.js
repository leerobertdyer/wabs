import { useState } from "react"


const Prompts = () => {
    const [prompt, setPrompt] = useState('')

    const handlePromptSubmit = async(event) => {
        event.preventDefault();
    const resp = await fetch(`${process.env.REACT_APP_BACKEND_URL}/get-prompt`, {
        method: "POST",
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
            prompt: prompt
        })
    });
    if (resp.ok) {
        const data = await resp.json();
        console.log(data);
    }
    }

  return (
    <>
    <form onSubmit={(event) => handlePromptSubmit(event)}>
    <input type="text" onChange={(event) => setPrompt(event.target.value)}></input>
    <button type="submit">Submit</button>
    </form>
    </>
  )
}

export default Prompts