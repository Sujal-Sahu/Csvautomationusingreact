import React, { useEffect, useState } from "react";
import Papa from "papaparse";

// Allowed extensions for input file
const allowedExtensions = ["csv"];

const App = () => {
	useEffect(()=>{
document.getElementById('atfinish').style.display="none";
document.getElementById('delayprocess').style.display="none";
	},[]);
	// This state will store the parsed data
	const [data, setData] = useState([]);
	
	// It state will contain the error when
	// correct file extension is not used
	const [error, setError] = useState("");
	
	// It will store the file uploaded by the user
	const [file, setFile] = useState("");

	// This function will be called when
	// the file input changes
	const handleFileChange = (e) => {
		setError("");
		
		// Check if user has entered the file
		if (e.target.files.length) {
			const inputFile = e.target.files[0];
			
			// Check the file extensions, if it not
			// included in the allowed extensions
			// we show the error
			const fileExtension = inputFile?.type.split("/")[1];
			if (!allowedExtensions.includes(fileExtension)) {
				setError("Please input a csv file");
				return;
			}

			// If input type is correct set the state
			setFile(inputFile);
		}
	};
	const date=new Date();
	const handleParse = () => {
		
		// If user clicks the parse button without
		// a file we show a error
		if (!file) return setError("Enter a valid file");

		// Initialize a reader which allows user
		// to read any file or blob.
		const reader = new FileReader();
		const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
		// Event listener on reader when the file
		// loads, we parse it and set the data.
		reader.onload = async ({ target }) => {
			const csv = Papa.parse(target.result, { header: true });
			const parsedData = csv?.data;
            console.log(parsedData);
			let counter=0;
			let start_second=date.getSeconds();
			
            for(let i=0;i<parsedData.length;i++){
                if(counter===40){
					let last_second=date.getSeconds();
					console.log(start_second);
					console.log(last_second);
					let delay_time;
					if(last_second>start_second && last_second<60){
						delay_time=60-(last_second-start_second);
					}
					else if(last_second<start_second){
						delay_time=60-((60-start_second)+last_second);
					}
					else{
						delay_time=0;
					}
					console.log(delay_time);
					// let de=toString(delay)+"000";
					// let realtimeout=parseInt(de);
					// console.log(realtimeout);
					// if(delay!=0){
					// 	let de=toString(delay)+"000";
					// 	let realtimeout=parseInt(de);
					// 	console.log(realtimeout);
					// 	document.getElementById('delayprocess').style.display="block";
					// 	setTimeout(() => {
					// 		document.getElementById('delayprocess').style.display="none";
					// 	}, realtimeout);
					// }
					console.log("sujal");
					document.getElementById('delayprocess').style.display="block";
					await delay(60000);
					document.getElementById('delayprocess').style.display="none";
					console.log("sahu");
				}
                const response=await fetch('https://api.interakt.ai/v1/public/track/users/',{
                    method:"POST",
                    headers:{
                        "Content-Type": "application/json",
                        "Authorization":
                          "Basic ZHNJVm9BdjZPR3BwZ29wUVJhNkl4VEc5ODVYT3REQ2lNVDZ4cjhBemdDVTo="
                    },
                    body:JSON.stringify({
                        userId: parsedData[i].id,
                        phoneNumber:parsedData[i].phone,
                        countryCode: parsedData[i].phoneCode,
                        traits: {
                          "name": parsedData[i].givenName,
                          "email": parsedData[i].email,
                        },
                    })
                })
                const mainresponse=await response.json();
                console.log(mainresponse);
				counter+=1;
            }
			document.getElementById('atfinish').style.display="block";
		};
		reader.readAsText(file);
	};

	return (
		<div>
			<label htmlFor="csvInput" style={{ display: "block" }}>
				Choose CSV File
			</label>
			<input
				onChange={handleFileChange}
				id="csvInput"
				name="file"
				type="File"
			/>
			<div>
				<button onClick={handleParse}>Update Interakt</button>
			</div>
			<div style={{ marginTop: "3rem" }}>
				{error ? error : data.map((col,
				idx) => <div key={idx}>{col}</div>)}
			</div>
			<div id="delayprocess" className="sujal" style={{display:"none"}}>Producing Delay due to rate limit!!</div>
			<div id="atfinish" className="sujal" style={{display:"none"}}>Finished!!</div>
		</div>
	);
};

export default App;
