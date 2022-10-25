

class Despesa{ 
    constructor(ano ,mes , dia , tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        //this faz referencia a classe, usando this[] acessamos os atributos (this[0] se refere a "mes")
        for (let i in this) { 
            if (this[i] === null || this[i] === undefined || this[i] === ""){ 
                return false
           }
        }
        return true
    }
}


class Bd { //acoes envolvendo manipulacao de dados do BD

    constructor(){

        let idLocalStorage = localStorage.getItem("id") //null porque em local storage nao tem uma key "id"

        if(idLocalStorage === null){ //caso nao exista uma key(id) em localStorage é criado uma com valor 0
            localStorage.setItem("id", 0) 
        }
    }

    getProximoId(){
        let idLocalStorage = localStorage.getItem("id") //null porque em local storage nao tem uma key "id"

        //retornadno o valor de id e somando 1 para ser ultilizado no proximo registo em localStorage
        return parseInt(idLocalStorage) + 1 
    }

    gravar( despesa ){

        let id = this.getProximoId()

      
        // sintaxe da funcao : localStorage.setItem('nome do item', notacaoJson)
        localStorage.setItem( id, JSON.stringify( despesa )) //convertendo o obj em notacao Json

        localStorage.setItem("id", id) //setando o valor da key(id) com valor atualizado pela funcao getProximoId
    }

    LimparForm(...param){ //recebe os campos do formulario usando o operador rest
        param.forEach( (campoDoFormulario) => { //itera sobre os parametros
            campoDoFormulario.value = "" ; //atribui uma string vazia
        });
    }

    recuperarRegistros(){

        let id = localStorage.getItem("id") //recupera a key id 
        let arrayDespesas = [] ; // recebe as despesas pelo for
        
        for(let i = 1; i <=id; i++ ){//recupera todas as despesas de localStorage

            let despesaRecebida = JSON.parse( localStorage.getItem(i) ) //despesa recebida

            if(despesaRecebida === null){ //caso id nao exista, o indice e pulado
                continue // pula para a proxima iteracao do for nao executando as linhas abaixo
            }

            despesaRecebida.id = i //adicionando id ao obj

            arrayDespesas.push(despesaRecebida) // atribuindo despesas no array
        }
        return arrayDespesas
    }

    pesquisar(despesa){

        let despesasBD = []
        despesasBD = this.recuperarRegistros()

        //metodo filter recupera os dados a partir do retoorno da funcao callback
        //(se a comparacao é true retorna o valor)

        let despesasFiltradas 

        if(despesa.ano != ""){

            despesasFiltradas = despesasBD.filter( function( valorCallback ){  return valorCallback.ano == despesa.ano})
        }
        if(despesa.mes != ""){

            despesasFiltradas = despesasBD.filter( function( valorCallback ){  return valorCallback.mes == despesa.mes})
        }
        if(despesa.dia != ""){

            despesasFiltradas = despesasBD.filter( function( valorCallback ){  return valorCallback.dia == despesa.dia})
        }
        if(despesa.tipo != ""){

            despesasFiltradas = despesasBD.filter( function( valorCallback ){  return valorCallback.tipo == despesa.tipo})
        }
        if(despesa.descricao != ""){

            despesasFiltradas = despesasBD.filter( function( valorCallback ){  return valorCallback.descricao == despesa.descricao})
        }
        if(despesa.valor != ""){

            despesasFiltradas = despesasBD.filter( function( valorCallback ){  return valorCallback.valor == despesa.valor})
        }
        
        return despesasFiltradas
    }

    removerDespesa(id){
        localStorage.removeItem(id)
        carregaListaDespesas()
    }

}
let bd = new Bd() ; //instanciando



function cadastrardispesa(){

    //variaveis
    let ano = document.getElementById("ano") 
    let mes = document.getElementById("mes") 
    let dia = document.getElementById("dia") 
    let tipo = document.getElementById("tipo")
    let descricao = document.getElementById("descricao")
    let valor = document.getElementById("valor") 


    let despesa = new Despesa( //instanciando classe Despesa com os valores recebidos pelo form de index

        //passando os parametros para o construtor da classe
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value,
    ) //final da instancia

    if(despesa.validarDados()){ //se os campos estiverem preenchidos os dados sao gravados 

        bd.gravar(despesa) //gravando a despesa
        bd.LimparForm(ano , mes, dia, tipo, descricao, valor) //limpando campos

        document.querySelector("#titulo").innerText = "Novo registro inserido";
        document.querySelector("#DivTitulo").className = "modal-header text-success";
        document.querySelector("#msgModal").innerText = "Despesa registrada com sucesso";
        document.querySelector("#btnModal").className = "btn btn-success"


        $("#modalFeedback").modal("show")
    }else{
        
        document.querySelector("#titulo").innerText = "Erro ao cadastrar despesas";
        document.querySelector("#DivTitulo").className = "modal-header text-danger";
        document.querySelector("#msgModal").innerText = "Existem campos obrigatorios que não foram preenchidos";
        document.querySelector("#btnModal").className = "btn btn-danger"

        $("#modalFeedback").modal("show")
    }
}

//pagina de consulta

function carregaListaDespesas( arrayDespesas = Array(), filtro = false){ //funcao para carregar dados na Tabela de consulta

    if(arrayDespesas.length == 0 && filtro == false ){
        arrayDespesas = bd.recuperarRegistros() //recebendo array do BD caso nao seja retornado um array filtrado
    }

    //selecionando o elemento Tbody da tabela
    let TbodyListaDespesas = document.querySelector("#TbodyListaDespesas")
    TbodyListaDespesas.innerHTML = ""

    //console.log(arrayDespesas)
    arrayDespesas.forEach( (despesa) => { //recuperando os valores do array
    //console.log(arrayDespesas)
        
        //criando linha da tabela (tr)
        let linha = TbodyListaDespesas.insertRow()
        
        // criando coluna (td)
        //insetCell busca uma referencia dentro da linha, comecando da esquerda para direita
        //sendo a primeira coluna de indice (0), a segunda com indice (1)

        linha.insertCell(0).innerText = `${despesa.dia}/${despesa.mes}/${despesa.ano} ` //Data 
        
        switch(despesa.tipo){// tipo vem como 1,2,3... 
            case "1":
                despesa.tipo = "Alimentação"
                break
            case "2": 
                despesa.tipo = "Educação"
                break
            case "3":
                despesa.tipo = "Lazer"
                break
            case "4":
                despesa.tipo = "Saude"
                break
            case "5":
                despesa.tipo = "Transporte"
                break
        }
        linha.insertCell(1).innerText = despesa.tipo 
                        
        linha.insertCell(2).innerText = despesa.descricao
        linha.insertCell(3).innerText = despesa.valor

        let btn = document.createElement("button")
        btn.className = "btn btn-danger"
        btn.innerHTML = " <i class='fas fa-trash'></i>"
        btn.id = despesa.id //criando botoes com id relacionados a sua despesa

        btn.onclick = function(){ 
            bd.removerDespesa( this.id )  //selecionando o id do botao(que e o mesmo que o de sua despesa)
        }

        linha.insertCell(4).append(btn)  //botao de excluir

    });
}

function PesquisaDespesas(){
    //variaveis
    let ano = document.getElementById("ano").value
    let mes = document.getElementById("mes").value
    let dia = document.getElementById("dia").value
    let tipo = document.getElementById("tipo").value
    let descricao = document.getElementById("descricao").value
    let valor = document.getElementById("valor").value

    let despesa = new Despesa(ano , mes, dia, tipo, descricao, valor) 
    
    let despesasFiltradas = bd.pesquisar(despesa)
    carregaListaDespesas( despesasFiltradas )

}


