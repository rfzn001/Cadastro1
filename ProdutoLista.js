import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, FlatList } from 'react-native';
import GestorDados from './dados/GestorDados';
import ProdutoItem from './ProdutoItem';
import { styles } from './CommonStyles';
import { useIsFocused } from '@react-navigation/native';

export default function ProdutoLista({ navigation }) {
  const gestor = new GestorDados();
  const [produtos, setProdutos] = useState([]);

  const isFocused = useIsFocused();

  // Atualiza a lista de produtos sempre que a tela fica focada
  useEffect(() => {
    gestor.obterTodos().then(objs => setProdutos(objs));
  }, [isFocused]);

  // Extrai a key para o FlatList
  const myKeyExtractor = item => item.codigo.toString();

  // Função para excluir produto e atualizar a lista após exclusão
  function excluirProduto(codigo) {
    gestor
      .remover(codigo)
      .then(() => gestor.obterTodos())
      .then(objs => setProdutos(objs))
      .catch(error => {
        console.error('Erro ao excluir produto:', error);
      });
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('NovoProd')}
      >
        <Text style={styles.buttonTextBig}>Novo Produto</Text>
      </TouchableOpacity>

      <FlatList
        style={styles.scrollContainer}
        data={produtos}
        contentContainerStyle={styles.itemsContainer}
        keyExtractor={myKeyExtractor}
        renderItem={({ item }) => (
          <ProdutoItem onDelete={() => excluirProduto(item.codigo)} produto={item} />
        )}
      />
    </View>
  );
}
