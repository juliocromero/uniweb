<template>
  <div class="fondo">
    <div class="form">
      <v-form>
        <v-img class="login" src="logo_white.png" />
        <v-container>
          <v-row
            align="center"
            justify="center"
            class="lightbox white--text pa-4 fill-height formulario"
          >
            <v-col cols="12" md="12">
              <v-text-field 
              :rules="[rules]" 
              v-model="email" 
              :counter="50" 
              label="Email"
              required
              @keyup.enter="ingresar()"
              >
              </v-text-field>
            </v-col>

            <v-col cols="12" md="12">
              <v-text-field
                :rules="[rules]"
                v-model="password"
                :counter="20"
                type="password"
                label="Contraseña"
                required
                @keyup.enter="ingresar()"
              ></v-text-field>
            </v-col>
            <v-col>
               <v-alert
                v-model="dialog"
                dense
                outlined
                type="error"
                class="mb-0 mt-6"
              >
              Usuario o Contraseña Incorrecta.!
              </v-alert>
            </v-col>
          </v-row>
          <div class="mb-5 mt-0 ingresar">
            <v-btn width="100%" small color="#3ba1da" dark @click="ingresar()">Ingresar</v-btn>
          </div>
          <v-row>
            <v-col>
               <v-img
                style="border-radius: 7px; margin-top: 20px; background-color: white;"
                max-height="130"
                max-width="170"
                alt="PX Control"
                src="/logo.png"
              ></v-img>
            </v-col>
            <v-col class="d-flex justify-end">
               <v-img
                style="border-radius: 7px; margin-top: 20px; background-color: white;"
                max-height="130"
                max-width="170"
                alt="PX Control"
                src="/logo.png"
              ></v-img>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </div>
  </div>
</template>

<script>
import axios from "~/plugins/axios";
import cookie from 'cookie'
import { mapMutations } from 'vuex';
export default {
layout: "layoutnull",

  middleware: 'AUTH',
  data() {
    return {
      rules: value => !!value || 'Este campo es obligatorio',
      alertError:"",
      dialog:false,
      password: "",
      email: ""
    };
  },
  methods:{
    ...mapMutations(["toggleAppBar","SET_AUTH","setUser"]),
    
    async ingresar(){       
       await axios
        .post("login", {
          email: this.email,
          password: this.password
        })
        .then(res => {
          
          if (res.data) {
            console.log(res.data)
            this.setUser(res.data.user)
            this.SET_AUTH(res.data)
          }
        })
        .catch(error => {
          console.log(error)
          this.dialog = true;
        }); 
    }
  },
}
</script>

<style scoped>
body{
    background-color: #295382
};
.create {
  font-size: 3vh;
  color: white;
}
.ingresar {
  width: 100%;
}

.fondo {
  background:#2c45b4;

  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
.img {
  position: fixed;
  width: 100%;
  height: 100vh;
}
.form {
  z-index: 100;
}
.login {
  width: 250px;
  height: 100%;
  margin: 0px auto;
  margin-top: 0px;
  top: 20px;
}

.container {
  align-content: center;
  text-align: center;
  align-self: center;
  justify-self: center;
  position: relative;
  top: 10vh;
  width: 80vh;
  background: #ffffff;
  border-radius: 10px;
  margin-bottom: 10vh;
}
@media (max-width: 700px) {
  .container {
    align-content: center;
    top: 5vh;
    margin-bottom: 5vh;
    width: 80%;
  }
}
</style>
<style>