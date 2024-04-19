export const sendFile = async(dict) =>{
    let rsp = await fetch("/salvaFile", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(dict),
      });
    rsp = await rsp.json();
    return rsp;
}

export const getFile = async(name) =>{
    let rsp = await fetch("/recuperaFile", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({name}),
    });
    rsp = await rsp.json();
    return rsp;
}

