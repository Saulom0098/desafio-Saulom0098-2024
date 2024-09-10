class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: [] },
            { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animaisExistentes: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: [] },
            { numero: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: [{ especie: 'LEAO', quantidade: 1 }] },
        ];

        this.animais = {
            LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true },
            LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
            CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
            MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            GAZELA: { tamanho: 2, biomas: ['savana'], carnivoro: false },
            HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false },
        };
    }
    analisaRecintos(animal, quantidade) {
        if (!this.animais[animal]) {
            return { erro: "Animal inválido", recintosViaveis: false };
        }

        if (quantidade <= 0) {
            return { erro: "Quantidade inválida", recintosViaveis: false };
        }

        const animalInfo = this.animais[animal];
        const recintosViaveis = [];

        // Iterando sobre cada recinto para verificar se é viável
        for (const recinto of this.recintos) {
            // Verificando se o bioma é compatível
            if (!animalInfo.biomas.includes(recinto.bioma) && !(animalInfo.biomas.includes('savana') && recinto.bioma === 'savana e rio')) {
                continue;
            }

            let espacoOcupado = 0;
            let temCarnivoro = false;
            let temHerbivoro = false;
            let maisDeUmaEspecie = false;

            // Verificando os animais existentes no recinto
            for (const animalExistente of recinto.animaisExistentes) {
                const infoAnimalExistente = this.animais[animalExistente.especie];
                espacoOcupado += animalExistente.quantidade * infoAnimalExistente.tamanho;

                if (infoAnimalExistente.carnivoro) {
                    temCarnivoro = true;
                } else {
                    temHerbivoro = true;
                }

                // Hipopótamos e outros animais no recinto
                if (animalExistente.especie !== animal && animal === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio') {
                    espacoOcupado = recinto.tamanhoTotal + 1; // Recinto inviável
                    break;
                }

                // Macacos não se sentem confortáveis sozinhos em um recinto vazio
                if (animal === 'MACACO' && recinto.animaisExistentes.length === 0) {??
                    espacoOcupado = recinto.tamanhoTotal + 1; // Recinto inviável
                    break;
                }

                if (recinto.animaisExistentes.length > 1 || (recinto.animaisExistentes.length === 1 && animalExistente.especie !== animal)) {
                    maisDeUmaEspecie = true;
                }
            }

             // Se o recinto já tem um carnívoro e o novo animal é diferente, o recinto é inviável
             if (temCarnivoro && !animalInfo.carnivoro) {
                continue;
            }

            // Se o recinto já tem um herbívoro e o novo animal é carn?ívoro, o recinto é inviável
            if (temHerbivoro && animalInfo.carnivoro) {
                continue;
            }

            // Adicionando o espaço do novo animal
            espacoOcupado += quantidade * animalInfo.tamanho;

            // Considerando o espaço extra caso haja mais de uma espécie
            if (maisDeUmaEspecie) {
                espacoOcupado += 1;
            }

            // Verificando se há espaço suficiente no recinto
            if (espacoOcupado <= recinto.tamanhoTotal) {
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${recinto.tamanhoTotal - espacoOcupado} total: ${recinto.tamanhoTotal})`);
            }
        }

        // Retornando o resultado final
        if (recintosViaveis.length > 0) {
            return { erro: false, recintosViaveis: recintosViaveis.sort((a, b) => parseInt(a.split(' ')[1]) - parseInt(b.split(' ')[1])) };
        } else {
            return { erro: "Não há recinto viável", recintosViaveis: false };
        }

    }

}

export { RecintosZoo as RecintosZoo };
