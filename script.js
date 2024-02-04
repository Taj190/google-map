let map;

        async function getUserIP(callback) {
            try {
                const apiURL = "https://api64.ipify.org?format=json";
                const fetchData = await fetch(apiURL);
                const response = await fetchData.json();
                const ipAddress = response.ip;
                document.getElementById('display-ip').innerText=`Your Current IP Address is ${ipAddress}`
                callback(ipAddress);
            } catch (error) {
                console.error(error);
            }
        }
       
        function getAPIInfo() {
            document.querySelector('.home-container').style.display = 'none';
            document.querySelector('#display-btn').style.display = 'none';
            document.querySelector('#info').style.display = 'block';
            document.querySelector('#message').style.display = 'block';
            
            getUserIP(ip => {
                document.getElementById('display-ip-2').innerText=`Your Current IP Address is ${ip}`
                const apiURL = `https://ipapi.co/${ip}/json/`;

                fetch(apiURL)
                    .then(response => response.json())
                    .then(data => {
                        console.log("API Response:", data);
 
                        const city = data.city ;
                        const region = data.region ;
                        const org = data.org ;
                        const latitude = parseFloat(data.latitude);
                        const longitude = parseFloat(data.longitude);
                        const currency = data.currency;
                        // const pincode = data.postal; 
                        const pincode = parseInt(data.postal);
                        getPostOffices(pincode);
                        initMap(latitude, longitude);
                        const localTime = getLocalTime(data.timezone);
                        document.getElementById("time").innerText = `User's Local Time: ${localTime}`;

                        let displayData = document.getElementById('displayUserData');
                        displayData.innerHTML = `
                            <tr>
                            <td class="td-custom">City: ${city}</td>
                            <td class="td-custom">Latitude: ${latitude}</td>
                            <td class="td-custom">Longitude: ${longitude}</td>
                            </tr>

                            <tr>
                            <td class="td-custom">region: ${region}</td>
                            <td class="td-custom">Hostname: ${org}</td>
                            <td class="td-custom">currency : ${currency}</td>
                           </tr>
                        `;

                        let displayMoreUserData = document.getElementById('displayMoreUserData');
                        const propertiesToDisplay = ['timezone', 'postal'];
                        for(let key of propertiesToDisplay){
                            if(data.hasOwnProperty(key)){
                                displayMoreUserData.innerHTML+=`
                                <p>${key}: ${data[key]}</p>
                                `
                            }
                        }
                           
                    })
                    .catch(error => console.error("Error fetching API data:", error));
            });
        }

        function initMap(latitude, longitude) {
            
            const iframe = document.createElement("iframe");
            iframe.src = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
            iframe.width = 1520;
            iframe.height = 270;
            iframe.style.border = "0";

            document.getElementById("map").appendChild(iframe);
        }

        function getLocalTime(timezone) {
            const options = {
                timeZone: timezone,
                hour12: false,
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
            };

            return new Date().toLocaleTimeString("en-US", options);
        }
       

  
        async function getPostOffices(pincode) {
            const apiUrl = `https://api.postalpincode.in/pincode/${pincode}`;
            
            try {
                let fetchData = await fetch(apiUrl);
                let response = await fetchData.json();
                console.log(response)
                if (response && response[0].Status === 'Success') {
                    
                } else {
                    console.error('No records found or API error');
                }
            } catch (error) {
                console.error('Error fetching post offices data:', error);
                
            }
        }
        

        

        window.addEventListener("load", function () {
            getUserIP(ip => {
                console.log("User's IP on load:", ip);
            });
        });