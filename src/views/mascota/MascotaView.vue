<template>
    <div>
        <h1>Lista de Mascotas</h1>
        <button @click="showModalNuevo = true" class="btn btn-primary">Nuevo</button>
        <button @click="filtrarPorEdad" class="btn btn-secondary" style="margin-left: 10px;">Filtrar Edad > 3</button>
        <input type="search" style="float:right" v-model="textToSearch" @input="buscar()" placeholder="Buscar por nombre, raza o especie">
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Especie</th>
                    <th>Raza</th>
                    <th>Edad</th>
                    <th>Dueño</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in filteredList" :key="index">
                    <td>{{ 1 + index }}</td>
                    <td>{{ item.nombre }}</td>
                    <td>{{ item.especie }}</td>
                    <td>{{ item.raza }}</td>
                    <td>{{ item.edad }}</td>
                    <td>{{ item.cliente ? item.cliente.nombre : 'Sin dueño' }}</td>
                    <td>
                        <button @click="edit(item)" class="btn btn-dark" style="margin-right: 15px;">Editar</button>
                        <button @click="Eliminar(item.id)" class="btn btn-danger">Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Modal para registrar nueva mascota -->
        <Modal v-model:modelValue="showModalNuevo">
            <MascotaNewView @on-register="onRegister" />
        </Modal>

        <!-- Modal para editar mascota -->
        <Modal v-model:modelValue="showModalEdit">
            <MascotaEditView @on-update="onUpdate" :item="itemToEdit" />
        </Modal>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import Modal from '../../components/Modal.vue'
import MascotaNewView from './MascotaNewView.vue'
import MascotaEditView from './MascotaEditView.vue'

export default {
    name: 'Mascota',
    data() {
        return {
            showModalNuevo: false,
            showModalEdit: false,
            itemToEdit: null,
            textToSearch: '',
            itemList: [], // Lista completa de mascotas
            filteredList: [] // Lista filtrada de mascotas
        }
    },
    components: {
        Modal,
        MascotaNewView,
        MascotaEditView
    },
    methods: {
        ...mapActions(['increment']),
        
        // Método para obtener la lista de mascotas
        getList() {
            const vm = this;
            this.axios.get(this.baseUrl + "/mascotas?_expand=cliente")
                .then(function (response) {
                    vm.itemList = response.data;
                    vm.filteredList = vm.itemList; // Inicializa la lista filtrada con todas las mascotas
                })
                .catch(function (error) {
                    console.error("Error al obtener la lista de mascotas:", error);
                });
        },

        // Método para filtrar mascotas cuya edad sea mayor a 3
        filtrarPorEdad() {
            this.filteredList = this.itemList.filter(item => item.edad > 3);
            console.log('Filtro aplicado: Mascotas con edad mayor a 3 años');
        },

        // Método para buscar mascotas según el texto de búsqueda
        buscar() {
            const searchQuery = this.textToSearch.trim().toLowerCase();
            this.filteredList = this.itemList.filter(item => {
                return (
                    item.nombre.toLowerCase().includes(searchQuery) ||
                    item.especie.toLowerCase().includes(searchQuery) ||
                    item.raza.toLowerCase().includes(searchQuery)
                );
            });
        },

        // Método para registrar una nueva mascota
        onRegister(newMascota) {
            const vm = this;
            this.axios.post(this.baseUrl + "/mascotas", newMascota)
                .then(function (response) {
                    vm.getList();  // Refresca la lista para mostrar la nueva mascota
                    vm.showModalNuevo = false;  // Cierra el modal de registro
                    vm.$toast.show('Registro exitoso', 'success');
                })
                .catch(function (error) {
                    console.error("Error al registrar la mascota:", error);
                    vm.$toast.show('Error al registrar la mascota', 'danger');
                });
        },

        // Método para editar una mascota
        edit(item) {
            this.itemToEdit = Object.assign({}, item);
            this.showModalEdit = true;
        },

        // Método para actualizar la información de la mascota
        onUpdate(updatedMascota) {
            const vm = this;
            this.axios.put(this.baseUrl + "/mascotas/" + updatedMascota.id, updatedMascota)
                .then(function (response) {
                    vm.getList();  // Refresca la lista para mostrar los cambios
                    vm.showModalEdit = false;  // Cierra el modal de edición
                    vm.itemToEdit = null;  // Limpia la selección de la mascota
                    vm.$toast.show('Edición exitosa', 'info');
                })
                .catch(function (error) {
                    console.error("Error al actualizar la mascota:", error);
                    vm.$toast.show('Error al guardar los cambios', 'danger');
                });
        },

        // Método para eliminar una mascota
        Eliminar(id) {
            if (confirm("¿Está seguro de eliminar el registro?")) {
                const vm = this;
                this.axios.delete(this.baseUrl + "/mascotas/" + id)
                    .then(function (response) {
                        vm.getList();  // Refresca la lista para actualizar la vista
                        vm.$toast.show("Registro eliminado.", "danger");
                    })
                    .catch(function (error) {
                        console.error("Error al eliminar la mascota:", error);
                    });
            }
        },
    },
    computed: {
        ...mapState(['count']),
        ...mapGetters(['doubleCount', 'getBaseUrl']),
        baseUrl() {
            return this.getBaseUrl;
        },
        filteredList() {
            return this.itemList.filter(item => {
                const searchQuery = this.textToSearch.trim().toLowerCase();
                return (
                    item.nombre.toLowerCase().includes(searchQuery) ||
                    item.especie.toLowerCase().includes(searchQuery) ||
                    item.raza.toLowerCase().includes(searchQuery)
                );
            });
        }
    },
    mounted() {
        this.getList();  // Cargar la lista de mascotas al montar el componente
    }
}
</script>

<style scoped>
/* Aquí puedes agregar tus estilos personalizados */
</style>
