<template>
  <v-app style="margin: 50px" id="home">
    <v-data-table
        :headers="headers"
        :items="urgencies"
        class="elevation-5"
        :search="search"
        :custom-filter="filter"
    >

      <template v-slot:top>
        <v-text-field
            v-model="search"
            label="Search"
            class="mx-4"
        ></v-text-field>
        <v-toolbar
            flat
        >
          <v-toolbar-title> {{ guardian.username }}</v-toolbar-title>
          <v-divider
              class="mx-4"
              inset
              vertical
          ></v-divider>
          <v-spacer></v-spacer>

          <v-dialog
              v-model="dialog"
              max-width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
              >
                New Item
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                      <v-text-field
                          v-model="editedItem.title"
                          label="Title"
                      ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                      <v-text-field
                          v-model="editedItem.summary"
                          label="Summary"
                      ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                      <v-text-field
                          v-model="editedItem.latitude"
                          label="Latitude"
                          type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                      <v-text-field
                          v-model="editedItem.longitude"
                          label="Longitude"
                          type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                      <v-text-field
                          v-model="editedItem.reportedAt"
                          label="Reported At"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="close">
                  Cancel
                </v-btn>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="save">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
            small
            @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn
            color="primary"
            @click="initialize"
        >
          Reset
        </v-btn>
      </template>
    </v-data-table>
  </v-app>
</template>

<script>
import GuardianUrgenciesApiService from "@/services/guardian-urgencies-api.service";
import GuardiansApiService from '@/services/guardians-api.service'


export default {
  name: "urgencies",
  data: () =>({
    search: '',
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'Title', align: 'start', value: 'title' },
      { text: 'Summary', value: 'summary' },
      { text: 'Latitude', value: 'latitude' },
      { text: 'Longitude', value: 'longitude' },
      { text: 'Reported At', value: 'reportedAt' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    urgencies: [],
    guardian: {},
    guardianId: -1,
    editedIndex: -1,
    editedItem: {
      title: '',
      summary: '',
      latitude: 0,
      longitude: 0,
      reportedAt: '',
    },
    defaultItem: {
      title: '',
      summary: '',
      latitude: '',
      longitude: '',
      reportedAt: '',
    },
  }),
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
    guardians(val) {
      console.log(val)
    }
  },

  created () {
    this.guardianId = parseInt(this.$route.params.id);
    this.getGuardian(this.guardianId)
    this.initialize()
  },

  methods: {
    filter (value, search) {
      return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLocaleLowerCase().indexOf(search) !== -1
    },

    initialize () {
      this.urgencies = []
      GuardianUrgenciesApiService.getAll(this.guardianId).then(response => {
        this.urgencies = response.data
      })
    },

    editItem (item) {
      this.editedIndex = this.urgencies.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.urgencies.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      GuardianUrgenciesApiService.delete(this.editedItem.id)
      this.urgencies.splice(this.editedIndex, 1);
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save () {
      if (this.editedItem.id > -1) {
        let id = this.editedItem.id
        GuardianUrgenciesApiService.update(id, this.editedItem).then(result => {
          console.log(result)
          this.initialize()
        })
      } else {
        GuardianUrgenciesApiService.create(this.guardianId, this.editedItem).then(result => {
          console.log(result)
          this.initialize()
        })
      }
      this.close()
    },
    getGuardian(id) {
      GuardiansApiService.get(id).then(result => {
        this.guardian = result.data
      })
    }
  },
}
</script>

<style scoped>

</style>