import * as React from 'react';
import { StyleSheet, FlatList, Text, View, Button } from 'react-native';

export default class SearchList extends React.Component {
    state = {
        refresh: false,
        data: [],
        food: null,
    }

    componentWillReceiveProps(props) {
        const { refresh, data } = this.props;
        if (props.refresh !== refresh && data != undefined) {
            this.setState({
                data: [...data.common, ...data.branded],
                refresh: !this.state.refresh,
                food: null
            })
        }
    }

    viewFood(query) {
        fetch(`https://trackapi.nutritionix.com/v2/natural/nutrients`, {
            method: 'POST', redirect: 'follow',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-app-id': '61aca91d',
                'x-app-key': '47240e9bd8d46633bab0cd154335e8e7',
                'x-remote-user-id': 132,
            },
            body: JSON.stringify({ query: query, }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            const nutritionixPayload = responseJson.foods[0];
            this.setState({ food: nutritionixPayload, data: [] });
            
            fetch(`https://us-central1-gini-v0.cloudfunctions.net/analyseNutritionixTest`, {
                method: 'POST',
                redirect: 'follow',
                headers: {
                    "Authorization": "Basic c7a5195c11e362086dcd8ce60dcc44ed",
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(nutritionixPayload),
            })
            .then((response) => response.json())
            .then((responseJson) => {
                const food = this.state.food; 
                food.score = responseJson.score; 
                this.setState({ food: food, });
            })
            .catch((error) => { console.error('API error', error); });

        })
        .catch((error) => { console.error(error); });
    }

    addFood() {
        fetch(`https://us-central1-gini-v0.cloudfunctions.net/logFoodTest`, {
            method: 'POST',
            redirect: 'follow',
            headers: {
                "Authorization": "Basic c7a5195c11e362086dcd8ce60dcc44ed",
                'content-type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({data: this.state.food}),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.table(responseJson);
            this.setState({food: null, data: []});
        })
        .catch((error) => { console.error('API error', error); });
    }

    render = () => {
        if (this.state.food != null) {
            return (<View style={styles.container}>
                <Text style={styles.item}>{this.state.food.food_name}</Text>
                <Text style={styles.item}>serving_qty: {this.state.food.serving_qty}</Text>
                <Text style={styles.item}>serving_unit: {this.state.food.serving_unit}</Text>
                <Text style={styles.item}>serving_weight_grams: {this.state.food.serving_weight_grams}</Text>
                <Text style={styles.item}>calories: {this.state.food.nf_calories}</Text>
                <Text style={styles.item}>total_fat: {this.state.food.nf_total_fat}</Text>
                <Text style={styles.item}>saturated_fat: {this.state.food.nf_saturated_fat}</Text>
                <Text style={styles.item}>cholesterol: {this.state.food.nf_cholesterol}</Text>
                <Text style={styles.item}>sodium: {this.state.food.nf_sodium}</Text>
                <Text style={styles.item}>total_carbohydrate: {this.state.food.nf_total_carbohydrate}</Text>
                <Text style={styles.item}>dietary_fiber: {this.state.food.nf_dietary_fiber}</Text>
                <Text style={styles.item}>sugars: {this.state.food.nf_sugars}</Text>
                <Text style={styles.item}>protein: {this.state.food.nf_protein}</Text>
                <Text style={styles.item}>potassium: {this.state.food.nf_potassium}</Text>
                <Text style={styles.item}>p: {this.state.food.nf_p}</Text>
                <Button
                    onPress={() => { this.addFood() }}
                    title="Add to Journal"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                ></Button>

            </View>)
        } else if (this.state.data != []) {
            return (<View style={styles.container}>
                <FlatList
                    data={this.state.data}
                    extraData={this.state.refresh}
                    renderItem={({ item }) =>
                        <View style={styles.item}>
                            <View style={styles.item_text}>
                                <Text style={styles.item_title}>{item.food_name}</Text>
                                <Text style={styles.item_detail}>{item.serving_unit}</Text>
                            </View>
                            <Button
                                onPress={() => { this.viewFood(`${item.serving_unit} ${item.food_name}`) }}
                                title="View"
                                color="#841584"
                                accessibilityLabel="Learn more about this purple button"
                            ></Button>
                        </View>
                    }
                />
            </View>)
        } else {
            return (<View style={styles.container}><Text>Empty State, search for a food</Text></View>)
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    item: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
    },
    item_text: { justifyContent: 'center', flex: 6 },
    item_title: {
        fontSize: 18,
    },
    item_detail: {
        fontSize: 14,
    },
});
