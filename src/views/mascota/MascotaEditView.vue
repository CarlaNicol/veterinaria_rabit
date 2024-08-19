<template>
  <div>
    <h1>Editar Mascota</h1>
    <form @submit.prevent="submitForm" v-if="form">
      <div class="form-group">
        <label for="cliente">Cliente:</label>
        <select id="cliente" v-model="form.clienteId" :class="{ 'is-invalid': errors.clienteId }">
          <option :value="cliente.id" v-for="(cliente, index) in clienteList" :key="`cliente-${index}`">{{ cliente.nombre }}
          </option>
        </select>
        <div v-if="errors.clienteId" class="invalid-feedback">{{ errors.clienteId }}</div>
      </div>

      <div class="form-group">
        <label for="name">Nombre mascota:</label>
        <input type="text" id="name" v-model="form.nombre" :class="{ 'is-invalid': errors.nombre }"
          placeholder="Ingrese el nombre" />
        <div v-if="errors.nombre" class="invalid-feedback">{{ errors.nombre }}</div>
      </div>

      <div class="form-group">
        <label for="especie">Especie:</label>
        <select id="especie" v-model="form.especie" :class="{ 'is-invalid': errors.especie }">
          <option :value="especie" v-for="(especie, index) in especieList" :key="`especie-${index}`">{{ especie }}</option>
        </select>
        <div v-if="errors.especie" class="invalid-feedback">{{ errors.especie }}</div>
      </div>

      <div class="form-group">
        <label for="raza">Raza:</label>
        <input type="text" id="raza" v-model="form.raza" :class="{ 'is-invalid': errors.raza }"
          placeholder="Ingrese la raza" />
        <div v-if="errors.raza" class="invalid-feedback">{{ errors.raza }}</div>
      </div>

      <div class="form-group">
        <label for="edad">Edad (Anios):</label>
        <input type="number" id="edad" v-model="form.edad" :class="{ 'is-invalid': errors.edad }"
          placeholder="Ingrese la edad" />
        <div v-if="errors.edad" class="invalid-feedback">{{ errors.edad }}</div>
      </div>
      <button type="submit" class="btn btn-primary">Registrar</button>
    </form>
  </div>
</template>
  
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'MascotaEdit',
  data() {
    return {
      clienteList: [],
      especieList: [
        "Perro",
        "Gato"
      ],
      errors: {}
    };
  },
  methods: {
    ...mapActions(['increment']),
    validateForm() {
      this.errors = {};

      if (!this.form.nombre) {
        this.errors.nombre = 'El nombre es obligatorio.';
      }

      if (!this.form.especie) {
        this.errors.especie = 'La especie es obligatoria.';
      }

      if (!this.form.raza) {
        this.errors.raza = 'La raza es obligatoria.';
      }

      if (!this.form.edad) {
        this.errors.edad = 'La edad es obligatoria.';
      }

      if (!this.form.clienteId) {
        this.errors.clienteId = 'El Cliente es obligatoria.';
      }

      return Object.keys(this.errors).length === 0;
    },

    submitForm() {
      if (this.validateForm()) {
        // Enviar los datos al servidor
        this.save();
        // Reiniciar el formulario
        this.form = {
          nombre: '',
          especie: '',
          raza: '',
          edad: '',
          clienteId: null
        };
      }
    },
    save() {
      const vm = this;
      this.axios.patch(this.baseUrl + "/mascotas/" + this.item.id, this.form)
        .then(function (response) {
          if (response.status == '200') {
            vm.$emit('on-update', response.data);
          }
          vm.itemList = response.data;
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
  },
  computed: {
    // propiedades computadas que dependen de otras propiedades reactivas
    ...mapState(['count']),
    ...mapGetters(['doubleCount', 'getBaseUrl']),
    baseUrl() {
      return this.getBaseUrl
    },
    form() {
      return Object.assign({},this.item);
    }
  },
  mounted() {
    this.getClienteList();
  },
  props: ['item']
}
</script>
  
<style scoped></style>
  