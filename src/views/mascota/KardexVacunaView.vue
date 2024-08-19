<template>
    <div v-if="mascotaDatos">
      <h1>Kardex de Vacunas {{mascotaId}}</h1>
      <div>
        <h2>Información del Dueño</h2>
        <p>Nombre: {{ mascotaDatos?.cliente.nombre }}</p>
        <p>Dirección: {{ mascotaDatos.cliente.direccion }}</p>
        <p>Teléfono: {{ mascotaDatos.cliente.telefono }}</p>
      </div>
      <div>
        <h2>Información de la Mascota</h2>
        <p>Nombre: {{ mascotaDatos.nombre }}</p>
        <p>Especie: {{ mascotaDatos.especie }} </p>
        <p>Raza: {{ mascotaDatos.raza }}</p>
        <p>Edad:{{ mascotaDatos.edad }}</p>
      </div>
      <div>
        <h2>Vacunas Aplicadas</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre de la Vacuna</th>
              <th>Fecha de Aplicación</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="vacuna in listaVacunas" :key="vacuna.id">
              <td>{{ vacuna.vacuna.nombre }}</td>
              <td>{{ vacuna.fecha }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  export default {
    name: 'KardexVacunaView',
    data() {
      return {
        owner: {
          name: 'Juan Pérez',
          address: '123 Calle Falsa',
          phone: '555-1234'
        },
        pet: {
          name: 'Firulais',
          species: 'Perro',
          breed: 'Labrador',
          age: '3 años'
        },
        mascotaDatos:null,
        listaVacunas:[],
        vaccines: [
          { id: 1, name: 'Rabia', date: '2022-01-15', veterinarian: 'Dr. Smith' },
          { id: 2, name: 'Parvovirus', date: '2022-02-20', veterinarian: 'Dr. Doe' },
          { id: 3, name: 'Moquillo', date: '2022-03-10', veterinarian: 'Dr. Brown' }
        ]
      };
    },
    methods: {
      getMascota(){
        const mascotaId = this.$route.params.id;
        const vm = this;
        this.axios.get(this.getBaseUrl+"/mascotas/"+mascotaId+"?_expand=cliente")
        .then(function(response){
          vm.mascotaDatos = response.data;
        })
        .catch(function(error){
          console.error(error);
        })
      },
      getVacuna(){
        const mascotaId = this.$route.params.id;
        const vm = this;
        this.axios.get(this.getBaseUrl+"/mascotasVacunas?_expand=vacuna&mascotaId="+mascotaId)
        .then(function(response){
          vm.listaVacunas = response.data;
        })
        .catch(function(error){
          console.error(error);
        })
      }
    },
    computed: {
      ...mapGetters(['getBaseUrl']),
        mascotaId() {
        // Recupera el parámetro de ruta 'id'
        return this.$route.params.id;
      }
    },
    mounted(){
      this.getMascota();
      this.getVacuna();
    }
  };
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  th {
    background-color: #f2f2f2;
  }
  </style>
  