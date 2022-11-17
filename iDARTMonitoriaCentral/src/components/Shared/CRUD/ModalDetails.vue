<template>
  <q-dialog v-model="details_dialog">
    <q-card class="my-card" style="width: 600px; max-width: 60vw" flat bordered>
      <q-card-section>
        <div class="text-h6">
          {{ title }}
          <q-btn
            round
            flat
            dense
            icon="close"
            class="float-right"
            color="grey-8"
            @click="close"
            v-close-popup
          ></q-btn>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="q-pt-xs">
          <div v-for="(row, key) in allRows" :key="key" class="row">
            <div v-for="(attribute, key1) in row" :key="key1" class="col">
              <q-item class="full-width">
                <q-item-section>
                  <q-item-label caption lines="1">
                    {{ t(attribute) }}
                  </q-item-label>
                  <q-item-label
                    class="text-grey-9"
                    v-if="
                      String(props.entity[attribute]).trim() !== null &&
                      String(props.entity[attribute]).trim() !== undefined &&
                      String(props.entity[attribute]).trim() !== ''
                    "
                    ><span
                      v-if="
                        props.entity[attribute] === true ||
                        props.entity[attribute] === false
                      "
                    >
                      {{ t(''.concat(props.entity[attribute])) }}
                    </span>
                    <span v-else>
                      {{ props.entity[attribute] }}
                    </span>
                  </q-item-label>
                  <q-item-label class="text-grey-9" v-else>
                    Sem Info.
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions vertical align="right">
        <q-btn
          label="Fechar"
          @click="close"
          type="reset"
          color="negative"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';

/*
  Declaration
*/
const { t } = useI18n();
const details_dialog = inject('details_dialog');
/*
  Props
  */

const props = defineProps({
  title: {
    type: String,
    default: 'Sem Titúlo',
  },
  // details_dialog: {
  //   type: Boolean,
  //   default: false,
  // },
  entity: {
    type: Object,
  },
  excludeAttribute: {
    type: Array,
  },
  close: {
    type: Function,
  },
});

/*
  Computed
*/
const allRows = computed(() => {
  const entiryKeys = Object.keys(
    removeAttributes(props.entity, props.excludeAttribute)
  );
  let row = [];
  let i = Math.ceil(entiryKeys.length / 2);
  for (let col = 0; col < i; col++) {
    row.push(entiryKeys.slice(col * 2, col * 2 + 2));
  }
  return row;
});

/*
  Methods
  */

const removeAttributes = (objectEntity, excludeAttributes) => {
  let localobjectEntity = Object.assign({}, objectEntity);
  excludeAttributes.forEach((attibute) => {
    delete localobjectEntity[attibute];
  });
  return localobjectEntity;
};
</script>
