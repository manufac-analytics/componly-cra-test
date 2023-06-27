const { createReadStream } = require("fs");

async function postScan() {
  const rawUserResponse = await fetch(
    "https://backend-production-e808.up.railway.app/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "assoulsidali@gmail.com",
        password: "123456",
      }),
    }
  );
  const { response: userInfo } = await rawUserResponse.json();

  const rawProjectInfo = await fetch(
    "https://backend-production-e808.up.railway.app/companies/projects?page=1&pageSize=1&with-cli=true&with-sourceCodes=true",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
  );
  const { projects } = await rawProjectInfo.json();
  const [project] = projects;
  const { id: cliId, password } = project.cli;
  const [sourceCode] = project.sourceCodes;

  const projectLoginResponse = await fetch(
    "https://backend-production-e808.up.railway.app/auth/login/cli",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cliId,
        password,
      }),
    }
  );
  const { token } = await projectLoginResponse.json();
  const formData=new FormData()
  const fileStream = createReadStream('./.componly/scan.json');
  formData.append("file",fileStream)
  formData.append("type","application/json")

  const rawPostScanResponse=await fetch(
    `https://backend-production-e808.up.railway.app/scans/upload/${sourceCode.id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data;boundary=asdasda",
        "Authorization": `Bearer ${token}`,
      },
      
      body:formData
    }
  );

  console.log(await rawPostScanResponse.json())
  
}

postScan();


// curl -X 'POST' \
//   'https://backend-production-e808.up.railway.app/scans/upload/f47f7313-6d56-4f9a-b931-4621d44dd811' \
//   -H 'accept: */*' \
//   -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0SWQiOiIwOTg3NDdhMi05ZjIxLTQxM2QtODU3Zi01YzgxODZmNTYwNTYiLCJjbGlJZCI6IjliY2M0NDg4LTBlZmQtNGJiNy1hNTU2LWY4Y2VhN2Y3NTdmYiIsImlhdCI6MTY4Nzg0OTExMiwiZXhwIjoxNjg3ODc5MTEyfQ.3dvU-cbyEIlABDYh6vVFwzfCXYBEmrzG-EXTQisr8Mg' \
//   -H 'Content-Type: multipart/form-data' \
//   -F 'file=@scan.json;type=application/json'