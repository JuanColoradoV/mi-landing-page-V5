// --- DATA SOURCE: PRODUCTS ---

import { t, translateColors } from '../i18n/i18n.js';
import { formatMoney } from '../currency/currency.js';

const rawProducts = [
    {
        "ref": "42-121",
        "key_name": "p_42_121_name",
        "key_desc": "p_42_121_desc",
        "price_cop": 130000,
        "price_sale_cop": null,
        "tallas": "XS, S, M, L, XL",
        "colores": "Blanco, Beige, Negro",
        "material": "Hilo tejido",
        "imageUrl": "images/42-121/dd4972603ae64735bdce400bccd7af08.SD-480p.mp4"
    },
    {
        "ref": "30-558",
        "key_name": "p_30_558_name",
        "key_desc": "p_30_558_desc",
        "price_cop": 160000,
        "price_sale_cop": null,
        "tallas": "XS, S, M, L, XL",
        "colores": "Blanco, Camel, Amarillo, Negro, Rosa Intenso, Azul, Palo de Rosa, Rojo",
        "material": "Blazer y pantalón en noches de viena y Blusa en piel de durazno",
        "imageUrl": "images/30-558/IMG-20251104-WA0020.jpg"
    },
    {
        "ref": "15-202",
        "key_name": "p_15_202_name",
        "key_desc": "p_15_202_desc",
        "price_cop": 85000,
        "price_sale_cop": null,
        "tallas": "XS, S, M, L, XL",
        "colores": "Estampado",
        "material": "Seda",
        "imageUrl": ""
    },
    {
        "ref": "30-609",
        "key_name": "p_30_609_name",
        "key_desc": "p_30_609_desc",
        "price_cop": 130000,
        "price_sale_cop": null,
        "tallas": "XS, S, M, L, XL",
        "colores": "Negro, Vino",
        "material": "Burda",
        "imageUrl": "images/30-609/rn-image_picker_lib_temp_682f2767-deee-4a79-87ee-240381cbaf5f.webp"
    },
    {
        "ref": "12-043",
        "key_name": "p_12_043_name",
        "key_desc": "p_12_043_desc",
        "price_cop": 98000,
        "price_sale_cop": 75000,
        "tallas": "XS, S, M, L, XL",
        "colores": "Negro, Blanco, Marrón",
        "material": "Popelina",
        "imageUrl": "images/12-043/IMG-20251104-WA0023.jpg"
    },
    {
        "ref": "42-099",
        "key_name": "p_42_099_name",
        "key_desc": "p_42_099_desc",
        "price_cop": 187000,
        "price_sale_cop": 140000,
        "tallas": "XS, S, M, L, XL",
        "colores": "Negro",
        "material": "",
        "imageUrl": "images/42-099/2468aca3b2e24d369016b4f5cd98039a.SD-480p.mp4"
    },
    {
        "ref": "42-092",
        "key_name": "p_42_092_name",
        "key_desc": "p_42_092_desc",
        "price_cop": 0,
        "price_sale_cop": null,
        "tallas": "XS, S, M, L, XL",
        "colores": "Negro, Rojo, Azul, Blanco",
        "material": "",
        "imageUrl": "images/42-092/IMG-20251104-WA0022.jpg"
    }
];

let cachedProducts = null;

export function getProductsData() {
    if (cachedProducts) return cachedProducts;

    cachedProducts = rawProducts.map(p => {
        let displayPrice = "";
        let numericPrice = p.price_sale_cop || p.price_cop;

        if (p.price_cop === 0) {
            displayPrice = t('price_consult');
        } else if (p.price_sale_cop) {
            const original = formatMoney(p.price_cop);
            const sale = formatMoney(p.price_sale_cop);
            displayPrice = `${original} ${t('offer_text')} ${sale}`;
        } else {
            displayPrice = formatMoney(p.price_cop);
        }

        return {
            ...p,
            nombre: t(p.key_name),
            descripcion: t(p.key_desc),
            colores: translateColors(p.colores),
            precio: displayPrice,
            numericPrice: numericPrice
        };
    });

    return cachedProducts;
}
