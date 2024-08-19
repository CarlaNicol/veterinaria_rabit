<template>
  <div>
    <h1>Registrar Cita</h1>
    <form @submit.prevent="submitForm">

      <div class="form-group">
        <label for="veterinario">Veterinario:</label>
        <select id="veterinario" v-model="form.veterinarioId" :class="{ 'is-invalid': errors.veterinarioId }">
          <option :value="veterinario.id" v-for="(veterinario, index) in veterinarioList" :key="`veterinario-${index}`">{{ veterinario.nombre }}
          </option>
        </select>
        <div v-if="errors.veterinarioId" class="invalid-feedback">{{ errors.veterinarioId }}</div>
      </div>

      <div class="form-group">
        <label for="cliente">Cliente:</label>
        <select id="cliente" v-model="form.clienteId" :class="{ 'is-invalid': errors.clienteId }" @change="setMascotas()">
          <option :value="cliente.id" v-for="(cliente, index) in clienteList" :key="`cliente-${index}`">{{ cliente.nombre }}
          </option>
        </select>
        <div v-if="errors.clienteId" class="invalid-feedback">{{ errors.clienteId }}</div>
      </div>

      <div class="form-group">
        <label for="mascota">Mascota:</label>
        <select id="mascota" v-model="form.mascotaId" :class="{ 'is-invalid': errors.mascotaId }">
          <option :value="mascota.id" v-for="(mascota, index) in mascotaList" :key="`cliente-${index}`">{{ mascota.nombre }}
          </option>
        </select>
        <div v-if="errors.mascotaId" class="invalid-feedback">{{ errors.mascotaId }}</div>
      </div>

      <div class="form-group">
        <label for="motivo">Motivo:</label>
        <select id="motivo" v-model="form.motivo" :class="{ 'is-invalid': errors.motivo }">
          <option :value="motivo" v-for="(motivo, index) in motivoList" :key="`motivo-${index}`">{{ motivo }}</option>
        </select>
        <div v-if="errors.motivo" class="invalid-feedback">{{ errors.motivo }}</div>
      </div>

      <div class="form-group">
        <label for="fecha">Fecha:</label>
        <input type="date" id="fecha" v-model="form.fecha" :class="{ 'is-invalid': errors.fecha }"
          placeholder="Ingrese la fecha" />
        <div v-if="errors.fecha" class="invalid-feedback">{{ errors.fecha }}</div>
      </div>

      <div class="form-group">
        <label for="hora">Hora:</label>
        <input type="time" id="fecha" v-model="form.hora" :class="{ 'is-invalid': errors.hora }"
          placeholder="Ingrese la hora" />
        <div v-if="errors.hora" class="invalid-feedback">{{ errors.hora }}</div>
      </div>
      
      <button type="submit" class="btn btn-primary">Registrar</button>
    </form>
  </div>
</template>
  
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'CitaNew',
  data() {
    return {
      veterinarioList: [],
      clienteList: [],
      mascotaList: [],
      motivoList: [
        "Vacunación",
        "Revisión cardiológica",
        "Chequeo general",
        "Chequeo dermatológico"
      ],
      form: {
        veterinarioId: null,
        clienteId: null,
        mascotaId: null,
        motivo:null,
        fecha:null,
        hora:null,
      },
      errors: {}
    };
  },
  methods: {
    ...mapActions(['increment']),
    validateForm() {
      this.errors = {};

      if (!this.form.veterinarioId) {
        this.errors.veterinarioId = 'El Veterinario es obligatorio.';
      }

      if (!this.form.clienteId) {
        this.errors.clienteId = 'El Cliente es obligatoria.';
      }
      
      if (!this.form.mascotaId) {
        this.errors.mascotaId = 'La mascota es obligatorio.';
      }

      if (!this.form.motivo) {
        this.errors.motivo = 'El motivo es obligatorio.';
      }

      if (!this.form.fecha) {
        this.errors.fecha = 'La fecha es obligatorio.';
      }

      if (!this.form.hora) {
        this.errors.hora = 'La hora es obligatorio.';
      }


      return Object.keys(this.errors).length === 0;
    },

    submitForm() {
      if (this.validateForm()) {
        // Enviar los datos al servidor
        this.save();
        // Reiniciar el formulario
        this.form = {
          clienteId: null
        };
      }
    },
    save() {
      const vm = this;
      this.axios.post(this.baseUrl + "/citas", this.form)
        .then(function (response) {
          if (response.status == '201') {
            vm.$emit('on-register', response.data);
          }
          vm.itemList = response.data;
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    getVeterinarioList() {
      const vm = this;
      this.axios.get(this.baseUrl + "/veterinarios")
        .then(function (response) {
          vm.veterinarioList = response.data;
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    getClienteList() {
      const vm = this;
      this.axios.get(this.baseUrl + "/clientes")
        .then(function (response) {
          vm.clienteList = response.data;
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    setMascotas(){
      const vm = this;
            this.axios.get(this.baseUrl + "/mascotas?clienteId=" + this.form.clienteId)
                .then(function (response) {
                    vm.mascotaList = response.data;
                })
                .catch(function (error) {
                    console.error(error);
                });
    }
  },
  computed: {
    // propiedades computadas que dependen de otras propiedades reactivas
    ...mapState(['count']),
    ...mapGetters(['doubleCount', 'getBaseUrl']),
    baseUrl() {
      return this.getBaseUrl
    }
  },
  mounted() {
    this.getClienteList();
    this.getVeterinarioList();
  },
}
</script>
  
<style scoped></style>
  