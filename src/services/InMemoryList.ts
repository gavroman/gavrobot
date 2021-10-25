import {IListStorage} from './interfaces';

export class InMemoryListStorage implements IListStorage {
    private list: string[] = [
        'Пленка пищевая',
        'Апельсины',
        'Пшено',
        'Рукав для запекания',
        'Мандарины',
        'Крупа кукурузная',
        'Фольга',
        'Груши',
        'Мука ржаная',
        'Бумага для выпечки',
        'Кабачки',
        'Мука пшеничная',
        'Губки для посуды',
        'Капуста белокочанная',
        'Шоколад',
        'Губки железные',
        'Лук',
        'Сода',
        'Перчатки',
        'Морковь',
        'Хлебцы',
        'Зелень',
        'Чай',
    ];

    public async add(items: string[]) {
        this.list.push(...items);
    }

    public async delete(index: number) {
        this.list.splice(index - 1, 1);
    }

    public async deleteAll() {
        this.list = [];
    }

    public async getAll() {
        return [...this.list];
    }
}

export const InMemoryList = new InMemoryListStorage();
