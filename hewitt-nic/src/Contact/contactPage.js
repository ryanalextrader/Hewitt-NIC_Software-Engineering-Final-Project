import { Layout, Flex, theme, Typography } from "antd";
import contactPageStyles from "./contactPageStyles";
// https://ant.design/components/icon antd icon
// https://youtu.be/faUYaR4Nb1E using double tone icon
// https://www.elegantthemes.com/blog/wordpress/call-link-html-phone-number link for call
import { PhoneTwoTone, MailTwoTone } from '@ant-design/icons';

const { Header } = Layout;
const { Text, Title } = Typography

const ContactPage = () => {

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // CONTACT US PAGE
  // title page 'Contact Us' with contactPageStyles.header
  // Phone/Email logo from antd and clickable link for the phone number/email
  
  return (
    <Layout direction="vertical" className="contactPage"> 


      <Header style={contactPageStyles.header}>
        <Flex justify="space-between" align="center">
          <Title>Contact Us</Title>
        </Flex>
      </Header>

      <div style={{ paddingTop: 12, background: colorBgContainer }}>
        <div style={{ padding: 80, background: "white", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
            <PhoneTwoTone twoToneColor="#5D3FD3" style={{ fontSize: 70, marginRight: 20 }} />
            <div>
              <Text strong>Phone</Text> <br />
              <a href="tel:360-835-8708">(360) 835-8708</a> <br />
              <Text>Mon - Thurs: 9 am - 4 pm PST</Text>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MailTwoTone twoToneColor='#5D3FD3' style={{ fontSize: 70, marginRight: 20 }} />
            <div>
              <Text strong>Email</Text> <br />
              <a href="mailto:independentinnovator@hewittlearning.org">
                independentinnovator@hewittlearning.org
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
// https://www.w3schools.com/tags/tryit.asp?filename=tryhtml_link_mailto
export default ContactPage;
