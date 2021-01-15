import gapi from "gapi-client";
import { ref } from "vue";
import axios from "axios";

interface Props {
    apiKey: string,
    clientId: string,
    accessType: string,
    scope: string,
    discoveryDocs: string[],
    grantAccessUrl: string
} 

export default (props: Props) => {
    const authInstance = ref();
    const user = ref();
    const grantAccessResponse = ref();

    
    const initAuth = () => {
        console.log(gapi, gapi.auth2)
        gapi.client
            .init({
                apiKey: props.apiKey,
                clientId: props.clientId,
                accessType: props.accessType,
                scope: `profile ${props.scope}`
            })
            .then(() => {
                authInstance.value = gapi.auth2.getAuthInstance();
                console.log({authInstance})
                
                authInstance.value.signIn(() => {
                    user.value = authInstance.value.currentUser.get();
                    const authuser = user.value.getAuthResponse().session_state.extraQueryParams.authuser

                    if (props.grantAccessUrl) {
                        authInstance.value
                            .grantOfflineAccess({
                                authuser: authuser
                            })
                            .then(({ code }: {code: string }) => {
                                const credentials = { code };
    
                                grantAccessResponse.value = axios({
                                    url: props.grantAccessUrl
                                });
                            })
                    }

                })
                
            })
    };

    gapi.load("client:auth2", initAuth)

    return {
        authInstance,
        user,
        grantAccessResponse
    }
}