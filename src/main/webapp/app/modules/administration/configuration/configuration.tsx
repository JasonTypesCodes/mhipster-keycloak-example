import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Badge, Input, Table } from 'reactstrap';
import { Translate } from 'react-jhipster';

import { getConfigurations, getEnv } from '../administration.reducer';
import { IRootState } from 'app/shared/reducers';

export interface IConfigurationPageProps extends StateProps, DispatchProps {}

export const ConfigurationPage = (props: IConfigurationPageProps) => {
  const [filter, setFilter] = useState('');
  const [reversePrefix, setReversePrefix] = useState(false);
  const [reverseProperties, setReverseProperties] = useState(false);

  useEffect(() => {
    props.getConfigurations();
    props.getEnv();
  }, []);

  const changeFilter = evt => setFilter(evt.target.value);

  const envFilterFn = configProp => configProp.toUpperCase().includes(filter.toUpperCase());

  const propsFilterFn = configProp => configProp.toUpperCase().includes(filter.toUpperCase());

  const changeReversePrefix = () => setReversePrefix(!reversePrefix);

  const changeReverseProperties = () => setReverseProperties(!reverseProperties);

  const { configuration } = props;

  const configProps = configuration && configuration.configProps ? configuration.configProps : {};

  const env = configuration && configuration.env ? configuration.env : {};

  return (
    <div>
      <h2 id="configuration-page-heading">
        <Translate contentKey="configuration.title">Configuration</Translate>
      </h2>
      <span>
        <Translate contentKey="configuration.filter">Filter</Translate>
      </span>{' '}
      <Input type="search" value={filter} onChange={changeFilter} name="search" id="search" />
      <label>Micronaut configuration</label>
      <Table className="table table-striped table-bordered table-responsive d-table">
        <thead>
          <tr>
            <th onClick={changeReversePrefix} className="w-50">
              <Translate contentKey="configuration.table.prefix">Property</Translate>
            </th>
            <th onClick={changeReverseProperties} className="w-50">
              <Translate contentKey="configuration.table.properties">Value</Translate>
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(configProps)
            .filter(propsFilterFn)
            .sort()
            .map((propKey, index) => (
              <tr key={index}>
                <td>{propKey}</td>
                <td>
                  <Badge className="float-right badge-secondary break">{JSON.stringify(configProps[propKey])}</Badge>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {env.propertySources
        ? env.propertySources.map((envKey, envIndex) => (
            <div key={envIndex}>
              <h4>
                <span>{envKey.name}</span>
              </h4>
              <Table className="table table-sm table-striped table-bordered table-responsive d-table">
                <thead>
                  <tr key={envIndex}>
                    <th className="w-50">Property</th>
                    <th className="w-50">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {envKey.properties
                    ? Object.keys(envKey.properties)
                        .filter(envFilterFn)
                        .map((propKey, propIndex) => (
                          <tr key={propIndex}>
                            <td className="break">{propKey}</td>
                            <td className="break">
                              <span className="float-right badge badge-secondary break">{JSON.stringify(envKey.properties[propKey])}</span>
                            </td>
                          </tr>
                        ))
                    : null}
                </tbody>
              </Table>
            </div>
          ))
        : null}
    </div>
  );
};

const mapStateToProps = ({ administration }: IRootState) => ({
  configuration: administration.configuration,
  isFetching: administration.loading,
});

const mapDispatchToProps = { getConfigurations, getEnv };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ConfigurationPage);
