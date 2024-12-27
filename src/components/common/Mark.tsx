import { renderToStaticMarkup } from "react-dom/server";
import { MdLocationPin } from "react-icons/md";

export const iconUrl = renderToStaticMarkup(<MdLocationPin color="#d3121f" />);
