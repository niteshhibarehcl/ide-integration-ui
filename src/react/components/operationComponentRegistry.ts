import { Constants } from "../../shared/constants";
import CreateView from "./operations/createview/CreateView";
import ShowProperties from "./operations/ShowProperties";

/**
 * A registry that maps operation names to their corresponding React UI components.
 * This allows dynamic rendering of components based on the operation name.
 *
 * @type {Record<string, React.FC>}
 */
const OperationComponentRegistry: Record<string, React.FC> = {
  /**
   * Component for the "Create View" operation.
   */
  [Constants.OPERATION_NAMES.CREATE_VIEW]: CreateView,

  /**
   * Component for the "Show Properties" operation.
   */
  [Constants.OPERATION_NAMES.SHOW_PROPERTIES]: ShowProperties,
};

export default OperationComponentRegistry;
