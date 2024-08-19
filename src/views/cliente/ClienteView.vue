<template>
    <div>
        <Modal v-model:modelValue="showModalNuevo">
            <RegisterClienteView @on-register="onRegister($event)" />
        </Modal>
        <Modal v-model:modelValue="showModalEdit">
            <EditClientView @on-update="onUpdate($event)" :item="itemToEdit" />
        </Modal>
        <h1>Lista de Clientes</h1>
        <button @click="showModalNuevo = true" class="btn btn-primary">Nuevo</button>
        <button @click="buscar()" class="btn btn-lith" style="float:right">Buscar</button>
        <input type="search" style="float:right" v-model="textToSearch" @search="buscar()" placeholder="Buscar por nombre, teléfono o dirección">
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in itemList" :key="index">
                    <td>{{ 1 + index }}</td>
                    <td>{{ item.nombre }}</td>
                    <td>{{ item.direccion }}</td>
                    <td>{{ item.telefono }}</td>
                    <td>
                        <button @click="edit(item)" class="btn btn-dark" style="margin-right: 15px;">Editar</button>
                        <button @click="Eliminar(item.id)" class="btn btn-danger">Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
  
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import Modal from '../../components/Modal.vue'
import RegisterClienteView from './RegisterClientView.vue'
import EditClientView from './EditClientView.vue'

export default {
    name: 'Cliente',
    data() {
        return {
            message: 'Hola Mundo',
            currentPage: 1,
            totalPages: 100, // Este valor debe ser calculado según tus datos
            showModalNuevo: false,
            showModalEdit: false,
            itemToEdit: null,
            textToSearch: '',
            itemList: []
        }
    },
    components: {
        // Registro de componentes que se utilizarán.
        Modal,
        RegisterClienteView,
        EditClientView
    },
    methods: {
        // métodos que se pueden llamar desde la plantilla o desde otras partes del componente.
        ...mapActions(['increment']),
        
        // Método para obtener la lista de clientes y filtrar en el frontend
        getList() {
            const vm = this;
            this.axios.get(this.baseUrl + "/clientes?_embed=mascotas")
                .then(function (response) {
                    console.log("Response Data:", response.data);
                    if (vm.textToSearch) {
                        const searchQuery = vm.textToSearch.trim().toLowerCase();
                        vm.itemList = response.data.filter(item => {
                            return (
                                item.nombre.toLowerCase().includes(searchQuery) ||
                                item.telefono.toLowerCase().includes(searchQuery) ||
                                item.direccion.toLowerCase().includes(searchQuery)
                            );
                        });
                    } else {
                        vm.itemList = response.data;
                    }
                })
                .catch(function (error) {
                    console.error("Error fetching data:", error);
                });
        },
        
        // Método para iniciar la búsqueda al hacer clic en el botón de buscar
        buscar() {
            this.getList();
        },
        
        // Métodos para editar, eliminar, registrar y actualizar clientes
        edit(item) {
            this.itemToEdit = Object.assign({}, item);
            this.showModalEdit = true;
        },
        Eliminar(id) {
            if (confirm("¿Está seguro de eliminar el registro?")) {
                const vm = this;
                this.axios.delete(this.baseUrl + "/clientes/" + id)
                    .then(function (response) {
                        console.log(response);
                        vm.getList();
                        vm.$toast.show("Registro eliminado.", "danger");
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            }
        },
        onRegister(event) {
            console.log("on register");
            this.getList();
            this.showModalNuevo = false;
            this.$toast.show('Registro exitoso', 'success');
        },
        onUpdate(event) {
            console.log("on update");
            this.getList();
            this.showModalEdit = false;
            this.itemToEdit = null;
            this.$toast.show('Edición exitosa', 'info');
        },
        showToast(message, type) {
            console.log("showToast");
            this.$toast.show(message, type);
        }
    },
    computed: {
        // Propiedades computadas que dependen de otras propiedades reactivas
        ...mapState(['count']),
        ...mapGetters(['doubleCount', 'getBaseUrl']),
        baseUrl() {
            return this.getBaseUrl;
        }
    },
    props: {
        // Propiedades que el componente puede recibir.
    },
    mounted() {
        this.getList();
    },
    emits: [] // Los eventos personalizados que el componente puede emitir.
}
</script>
  
<style scoped>
/* Aquí puedes agregar tus estilos personalizados */
</style>
