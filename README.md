# NETHERMIR
Nethermir is an innovation project by Universitat Autònoma de Barcelona that aims to automate all the process of Virtual Labs on the university. From creating users and managing the database, to clone, pause, start VM Machines from API calls to Proxmox, to generating the tunnels needed for the Wireguard VPN connection by enabling the corresponding routes and VLANS with Routeos API calls to a Mikrotik router.  

## Code Structure 
The project follows the next structure:
- **node_server**: Backend, execute by ```node src.js ``` inside the corresponding folder
    - **src**: All node-js production code is written here, subdivided in different files depending on the purpouse and scope of the code. 
        - **app.js**: Every endpoint point and call to function is done here, no functions should be declared here.  
        - **cookies.js**: Cookie managment
        - **database.js**: Database managment
        - **emails.js**: Emails managment
        - **proxmox.js**: Proxmox managment
        - **routeros.js**: Routeros managment

How do we communicate to the frontend? -> ```feedbackFetch(text, res)```
- **vue-client**: Frontend, compile and execute by ```vue serve```
    - **public**: There are two files here, ```favicon.ico``` and ``` index.html```. We will only modify favicon.ico if we want to update it, no more changes should be made if not needed (ex. applying bootstrap)
        - favicon.ico
        - index.html
    - **src**
        - **assets**: All imgs, videos will be stored here
        - **components**: These are meant to be reusable, small parts of the webpage, single elements, to make the code cleaner and more organized
        - **router**: We will define 
        - **store**: Haven't use it, it came when I created the project and haven't used it
        - **views**: Every view defines one page, and should be build using the corresponding components
        - **App.vue**: Here we can define global-scope style
        - **main.js**: Nothing to see here, don't touch if not needed

                                        
